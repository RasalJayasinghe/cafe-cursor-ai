import { NextRequest, NextResponse } from "next/server";
import { projectsDb } from "@/lib/db";
import { createProjectSchema } from "@/lib/validations";

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await projectsDb.getAll();
    // Sort by creation date (newest first)
    const sorted = projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createProjectSchema.parse(body);

    // Create project
    const newProject = await projectsDb.create(validatedData);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
