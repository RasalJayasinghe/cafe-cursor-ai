import { NextRequest, NextResponse } from "next/server";

// Parse Cloudinary URL format: cloudinary://api_key:api_secret@cloud_name
function parseCloudinaryUrl(url: string) {
  try {
    const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      return {
        apiKey: match[1],
        apiSecret: match[2],
        cloudName: match[3],
      };
    }
  } catch (e) {
    console.error("Failed to parse CLOUDINARY_URL:", e);
  }
  return null;
}

// Get Cloudinary config from environment
function getCloudinaryConfig() {
  // Try CLOUDINARY_URL first (standard format)
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    const parsed = parseCloudinaryUrl(cloudinaryUrl);
    if (parsed) return parsed;
  }

  // Fallback to individual env vars
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  return null;
}

// This endpoint provides the Cloudinary upload configuration
export async function GET() {
  const config = getCloudinaryConfig();

  if (!config) {
    return NextResponse.json(
      {
        error: "Cloudinary not configured",
        message: "Set CLOUDINARY_URL in environment variables",
        fallback: "imgbb",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    provider: "cloudinary",
    cloudName: config.cloudName,
    configured: true,
  });
}

// Server-side upload - Cloudinary with signed upload or imgBB fallback
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const uploaderName = formData.get("uploadedBy") as string;
    const caption = formData.get("caption") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Try Cloudinary first
    const cloudinaryConfig = getCloudinaryConfig();

    if (cloudinaryConfig) {
      const { cloudName, apiKey, apiSecret } = cloudinaryConfig;
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = "cafe-cursor-moments";

      // Generate signature for signed upload
      const crypto = await import("crypto");
      const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto
        .createHash("sha1")
        .update(signatureString)
        .digest("hex");

      // Upload to Cloudinary with signed request
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", `data:${file.type};base64,${base64}`);
      cloudinaryForm.append("api_key", apiKey);
      cloudinaryForm.append("timestamp", timestamp.toString());
      cloudinaryForm.append("signature", signature);
      cloudinaryForm.append("folder", folder);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryForm,
        }
      );

      if (cloudinaryResponse.ok) {
        const cloudinaryData = await cloudinaryResponse.json();
        return NextResponse.json({
          success: true,
          provider: "cloudinary",
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          uploadedBy: uploaderName,
          caption,
        });
      } else {
        console.error("Cloudinary upload failed, falling back to imgBB");
      }
    }

    // Fallback to imgBB (free)
    const imgbbApiKey = process.env.IMGBB_API_KEY || "6d207e02198a847aa98d0a2a901485a5";
    
    const imgbbForm = new FormData();
    imgbbForm.append("key", imgbbApiKey);
    imgbbForm.append("image", base64);
    imgbbForm.append("name", `cafe-cursor-${Date.now()}`);

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbForm,
    });

    if (!imgbbResponse.ok) {
      throw new Error("imgBB upload failed");
    }

    const imgbbData = await imgbbResponse.json();

    if (!imgbbData.success) {
      throw new Error(imgbbData.error?.message || "imgBB upload failed");
    }

    return NextResponse.json({
      success: true,
      provider: "imgbb",
      url: imgbbData.data.url,
      deleteUrl: imgbbData.data.delete_url,
      uploadedBy: uploaderName,
      caption,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image", message: error.message },
      { status: 500 }
    );
  }
}

