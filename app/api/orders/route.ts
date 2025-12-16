import { NextRequest, NextResponse } from "next/server";
import { ordersDb } from "@/lib/db";
import { createOrderSchema } from "@/lib/validations";

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await ordersDb.getAll();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createOrderSchema.parse(body);

    // Create order
    const newOrder = await ordersDb.create(validatedData);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
