import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ordersDb } from "@/lib/db";

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

// POST /api/attendees/verify - Verify email and check if already claimed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Step 1: Check if email exists in CSV
    const attendeeCheck = verifyAttendeeEmail(email);
    
    if (!attendeeCheck.valid) {
      return NextResponse.json(
        {
          error: "Not registered",
          message: "This email is not registered for the event. Please check your email address.",
          registered: false,
        },
        { status: 403 }
      );
    }

    // Step 2: Check if already claimed
    const existingOrder = await ordersDb.getByEmail(email);

    if (existingOrder) {
      return NextResponse.json(
        {
          error: "Already claimed",
          message: "You have already claimed your meal.",
          registered: true,
          alreadyClaimed: true,
          existingOrder: {
            token: existingOrder.token,
            items: existingOrder.items,
            claimedAt: existingOrder.createdAt,
            customerName: existingOrder.customerName,
          },
        },
        { status: 409 }
      );
    }

    // Email is valid and hasn't claimed yet
    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        registered: true,
        alreadyClaimed: false,
        attendee: {
          email,
          name: attendeeCheck.name || "Guest",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Verification failed", message: error.message },
      { status: 500 }
    );
  }
}
