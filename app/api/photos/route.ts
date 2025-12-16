import { NextRequest, NextResponse } from "next/server";
import { photosDb } from "@/lib/db";
import { createPhotoSchema } from "@/lib/validations";

// GET /api/photos - Get all photos
export async function GET() {
  try {
    const photos = await photosDb.getAll();
    // Sort by upload date (newest first)
    const sorted = photos.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

// POST /api/photos - Upload new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createPhotoSchema.parse(body);

    // Create photo record
    const newPhoto = await photosDb.create(validatedData);

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error: any) {
    console.error("Error uploading photo:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
