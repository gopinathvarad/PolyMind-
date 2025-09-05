import { NextRequest, NextResponse } from "next/server";
import { generateMultipleResponses } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { message, modelIds } = await request.json();

    if (!message || !modelIds || !Array.isArray(modelIds)) {
      return NextResponse.json(
        { error: "Message and modelIds are required" },
        { status: 400 }
      );
    }

    const responses = await generateMultipleResponses(modelIds, message);

    return NextResponse.json({ responses });
  } catch (error) {
    console.error("Error generating responses:", error);
    return NextResponse.json(
      { error: "Failed to generate responses" },
      { status: 500 }
    );
  }
}
