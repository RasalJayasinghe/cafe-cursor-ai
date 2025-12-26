import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET /api/admin/attendees - Get all attendees from CSV
export async function GET(request: NextRequest) {
  try {
    const csvPath = path.join(process.cwd(), "attendees.csv");
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: "Attendees CSV not found", attendees: [] },
        { status: 404 }
      );
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");

    if (lines.length < 2) {
      return NextResponse.json({ attendees: [], total: 0 });
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const emailIdx = headers.indexOf("email");
    const nameIdx = headers.indexOf("name");
    const firstNameIdx = headers.indexOf("first_name");
    const lastNameIdx = headers.indexOf("last_name");

    if (emailIdx === -1) {
      return NextResponse.json(
        { error: "CSV must have an 'email' column", attendees: [] },
        { status: 400 }
      );
    }

    const attendees = lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const email = values[emailIdx] || "";
        
        // Try to get name from various columns
        let name = nameIdx !== -1 ? values[nameIdx] : "";
        if (!name && firstNameIdx !== -1) {
          const firstName = values[firstNameIdx] || "";
          const lastName = lastNameIdx !== -1 ? values[lastNameIdx] || "" : "";
          name = `${firstName} ${lastName}`.trim();
        }
        if (!name) {
          name = email.split("@")[0]; // Fallback to email prefix
        }

        return { name, email };
      })
      .filter((att) => att.email); // Only include rows with email

    return NextResponse.json({
      success: true,
      total: attendees.length,
      attendees,
    });
  } catch (error: any) {
    console.error("Error reading attendees CSV:", error);
    return NextResponse.json(
      { error: "Failed to read attendees", message: error.message },
      { status: 500 }
    );
  }
}

