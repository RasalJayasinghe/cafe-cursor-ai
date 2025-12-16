import { NextRequest, NextResponse } from "next/server";
import { ordersDb } from "@/lib/db";

// POST /api/tokens/verify - Verify if token is valid and unused
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email } = body;

    if (!token && !email) {
      return NextResponse.json(
        { error: "Token or email is required" },
        { status: 400 }
      );
    }

    // Get all orders
    const orders = await ordersDb.getAll();

    // Check if token/email already used
    const existingOrder = orders.find(
      (order) =>
        (token && order.token === token) || (email && order.email === email)
    );

    if (existingOrder) {
      return NextResponse.json(
        {
          valid: false,
          alreadyUsed: true,
          message: "This token/email has already been used to claim a meal.",
          order: {
            token: existingOrder.token,
            claimedAt: existingOrder.createdAt,
            items: existingOrder.items,
          },
        },
        { status: 200 }
      );
    }

    // Token/email is valid and unused
    return NextResponse.json({
      valid: true,
      alreadyUsed: false,
      message: "Token is valid. You can proceed with your order.",
    });
  } catch (error: any) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
