import { NextRequest, NextResponse } from "next/server";
import { photosDb } from "@/lib/db";
import { z } from "zod";

// GET /api/photos - Get photos (approved only for public, all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const showPending = searchParams.get("pending") === "true";

    let photos;
    if (showPending) {
      photos = await photosDb.getPending();
    } else if (showAll) {
      photos = await photosDb.getAll();
    } else {
      photos = await photosDb.getApproved();
    }

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

// Validation schema for photo upload
const uploadPhotoSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().optional(),
  caption: z.string().max(200).optional(),
  uploadedBy: z.string().min(1, "Name is required").max(50),
});

// POST /api/photos - Upload new photo (goes to pending)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = uploadPhotoSchema.parse(body);

    // Create photo record with pending status
    const newPhoto = await photosDb.create({
      url: validatedData.url,
      publicId: validatedData.publicId,
      caption: validatedData.caption || "",
      uploadedBy: validatedData.uploadedBy,
    });

    return NextResponse.json(
      {
        ...newPhoto,
        message: "Photo uploaded! It will appear after admin approval.",
      },
      { status: 201 }
    );
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
