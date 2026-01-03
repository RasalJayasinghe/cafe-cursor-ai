import { NextRequest, NextResponse } from "next/server";
import { ordersDb } from "@/lib/db";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Validation schema for meal claim
const claimMealSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(2, "Name is required").optional(),
  phone: z.string().optional(),
  foodItem: z.string().min(1, "Please select a food item"),
  drinkItem: z.string().min(1, "Please select a drink item"),
});

// Generate a unique meal token
const generateMealToken = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

// Verify email exists in attendees CSV
function verifyAttendeeEmail(email: string): { valid: boolean; name?: string } {
  try {
    const csvPath = path.join(process.cwd(), "attendees.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");

    if (lines.length < 2) return { valid: false };

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const emailIdx = headers.indexOf("email");
    const nameIdx = headers.indexOf("name");

    if (emailIdx === -1) return { valid: false };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const rowEmail = values[emailIdx]?.toLowerCase() || "";
      
      if (rowEmail === email.toLowerCase()) {
        const name = nameIdx !== -1 ? values[nameIdx] : undefined;
        return { valid: true, name };
      }
    }

    return { valid: false };
  } catch (error) {
    console.error("Error reading attendees CSV:", error);
    return { valid: false };
  }
}

// POST /api/tokens/claim - Claim meal with verified email (one-time only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = claimMealSchema.parse(body);
    const { email, name, phone, foodItem, drinkItem } = validatedData;

    // Step 1: Verify email exists in attendees list
    const attendeeCheck = verifyAttendeeEmail(email);
    if (!attendeeCheck.valid) {
      return NextResponse.json(
        {
          error: "Email not registered",
          message:
            "This email is not registered for the event. Please check your email address.",
        },
        { status: 403 } // 403 Forbidden
      );
    }

    // Step 2: Check if email has already claimed a meal (using new getByEmail method)
    const existingOrder = await ordersDb.getByEmail(email);

    if (existingOrder) {
      return NextResponse.json(
        {
          error: "Already claimed",
          message: "This email has already been used to claim a meal.",
          alreadyClaimed: true,
          existingOrder: {
            token: existingOrder.token,
            items: existingOrder.items,
            claimedAt: existingOrder.createdAt,
            customerName: existingOrder.customerName,
          },
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Step 3: Generate unique token
    let token = generateMealToken();
    const allOrders = await ordersDb.getAll();
    // Ensure token is unique
    while (allOrders.some((order) => order.token === token)) {
      token = generateMealToken();
    }

    // Step 4: Create order with token (marks as claimed)
    const customerName = name || attendeeCheck.name || "Guest";
    const newOrder = await ordersDb.create({
      token,
      customerName,
      email,
      phone: phone || "",
      orderType: "dine-in" as const,
      items: [
        {
          name: foodItem,
          quantity: 1,
          price: 0, // Free meal
        },
        {
          name: drinkItem,
          quantity: 1,
          price: 0, // Free drink
        },
      ],
      total: 0,
      status: "pending" as const,
      claimed: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Meal claimed successfully!",
        order: newOrder,
        token: token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error claiming meal:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to claim meal", message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/tokens/claim - Get all claimed meals (admin endpoint)
export async function GET(request: NextRequest) {
  try {
    const allOrders = await ordersDb.getAll();
    const claimedMeals = allOrders.filter((order) => order.claimed);

    return NextResponse.json({
      success: true,
      total: claimedMeals.length,
      claims: claimedMeals.map((order) => ({
        id: order.id,
        email: order.email,
        customerName: order.customerName,
        token: order.token,
        items: order.items,
        createdAt: order.createdAt,
        claimedAt: order.createdAt, // Alias for backwards compatibility
        status: order.status,
        claimed: order.claimed,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching claims:", error);
    return NextResponse.json(
      { error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

// DELETE /api/tokens/claim - Delete a claim by email (admin endpoint)
// This allows someone to reclaim their meal
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required", usage: "DELETE /api/tokens/claim?email=user@example.com" },
        { status: 400 }
      );
    }

    // Find and delete the order
    const allOrders = await ordersDb.getAll();
    const orderToDelete = allOrders.find(
      (order) => order.email.toLowerCase() === email.toLowerCase()
    );

    if (!orderToDelete) {
      return NextResponse.json(
        { error: "No claim found for this email", email },
        { status: 404 }
      );
    }

    const deleted = await ordersDb.delete(orderToDelete.id);

    if (deleted) {
      return NextResponse.json({
        success: true,
        message: `Claim deleted for ${email}. User can now claim again.`,
        deletedOrder: {
          id: orderToDelete.id,
          email: orderToDelete.email,
          token: orderToDelete.token,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete claim" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error deleting claim:", error);
    return NextResponse.json(
      { error: "Failed to delete claim", message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/tokens/claim - Update order status (admin endpoint)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, status } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status", validStatuses },
        { status: 400 }
      );
    }

    // Find the order
    const allOrders = await ordersDb.getAll();
    const order = allOrders.find(
      (o) => o.email.toLowerCase() === email.toLowerCase()
    );

    if (!order) {
      return NextResponse.json(
        { error: "No claim found for this email" },
        { status: 404 }
      );
    }

    // Update the order
    const updatedOrder = await ordersDb.update(order.id, { status });

    return NextResponse.json({
      success: true,
      message: `Order status updated to "${status}"`,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating claim:", error);
    return NextResponse.json(
      { error: "Failed to update claim", message: error.message },
      { status: 500 }
    );
  }
}
