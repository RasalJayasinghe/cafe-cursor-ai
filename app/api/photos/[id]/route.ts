import { NextRequest, NextResponse } from "next/server";
import { photosDb } from "@/lib/db";
import { z } from "zod";

// GET /api/photos/[id] - Get single photo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const photo = await photosDb.getById(id);

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}

// DELETE /api/photos/[id] - Delete photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await photosDb.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}

// PUT /api/photos/[id] - Update photo status (admin approval)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateSchema = z.object({
      status: z.enum(["pending", "approved", "rejected"]),
      reviewedBy: z.string().optional(),
    });

    const { status, reviewedBy } = updateSchema.parse(body);

    const updatedPhoto = await photosDb.updateStatus(id, status, reviewedBy);

    if (!updatedPhoto) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedPhoto,
      message: `Photo ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "set to pending"}`,
    });
  } catch (error: any) {
    console.error("Error updating photo status:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update photo status" },
      { status: 500 }
    );
  }
}

// PATCH /api/photos/[id] - Increment likes (with user tracking)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get or create user ID from cookies
    let userId = request.cookies.get("userId")?.value;
    if (!userId) {
      // Generate a new user ID if it doesn't exist
      userId = crypto.randomUUID();
    }

    const result = await photosDb.incrementLikes(id, userId);

    if (!result) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error, alreadyLiked: true },
        { status: 400 }
      );
    }

    // Set the userId cookie for future requests
    const response = NextResponse.json(result.photo);
    response.cookies.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });

    return response;
  } catch (error) {
    console.error("Error incrementing likes:", error);
    return NextResponse.json(
      { error: "Failed to increment likes" },
      { status: 500 }
    );
  }
}
