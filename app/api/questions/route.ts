import { NextRequest, NextResponse } from "next/server";
import { questionsDb } from "@/lib/db";
import { createQuestionSchema, answerQuestionSchema } from "@/lib/validations";

// GET /api/questions - Get all questions
export async function GET() {
  try {
    const questions = await questionsDb.getAll();
    // Sort by ask date (newest first)
    const sorted = questions.sort(
      (a, b) => new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime()
    );
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/questions - Ask new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createQuestionSchema.parse(body);

    // Create question
    const newQuestion = await questionsDb.create(validatedData);

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error: any) {
    console.error("Error creating question:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

// PUT /api/questions - Answer a question
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, answer } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Validate answer
    const validatedData = answerQuestionSchema.parse({ answer });

    // Answer question
    const updatedQuestion = await questionsDb.answer(id, validatedData.answer);

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    console.error("Error answering question:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    );
  }
}
