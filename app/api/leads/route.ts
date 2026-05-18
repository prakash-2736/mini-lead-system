import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { LeadInputSchema } from "@/lib/validators";
import { allocateLead } from "@/services/leadAllocator";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON body",
      },
      { status: 400 },
    );
  }

  const parsed = LeadInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const lead = await Lead.create(parsed.data);

    await allocateLead(lead._id.toString());

    return NextResponse.json(
      {
        success: true,
        lead,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const mongoError = error as { code?: number };

    // duplicate key
    if (mongoError.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead already exists for this phone + service",
        },
        { status: 409 },
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    );
  }
}
