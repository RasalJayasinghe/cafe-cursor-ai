import { NextRequest, NextResponse } from "next/server";
import { ordersDb } from "@/lib/db";
import { z } from "zod";

// Validation schema for meal claim
const claimMealSchema = z.object({
  token: z.string().min(1, "Token is required"),
  email: z.string().email("Valid email is required"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  foodItem: z.string().min(1, "Please select a food item"),
  drinkItem: z.string().min(1, "Please select a drink item"),
});

// POST /api/tokens/claim - Claim meal with token (one-time only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = claimMealSchema.parse(body);
    const { token, email, name, phone, foodItem, drinkItem } = validatedData;

    // Double-check: Verify token hasn't been used
    const orders = await ordersDb.getAll();
    const existingOrder = orders.find(
      (order) => order.token === token || order.email === email
    );

    if (existingOrder) {
      return NextResponse.json(
        {
          error: "Token already used",
          message: "This token or email has already been used to claim a meal.",
          alreadyClaimed: true,
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Create order with token
    const newOrder = await ordersDb.create({
      token,
      customerName: name,
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
    });

    return NextResponse.json(
      {
        success: true,
        message: "Meal claimed successfully!",
        order: newOrder,
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
      { error: "Failed to claim meal" },
      { status: 500 }
    );
  }
}
