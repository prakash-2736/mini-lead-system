import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { LeadInputSchema } from "@/lib/validators";
import { allocateLead } from "@/services/leadAllocator";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

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

    const lead = await Lead.create(parsed.data);

    try {
      await allocateLead(lead._id.toString());
    } catch (allocationError) {
      await Lead.findByIdAndDelete(lead._id);

      return NextResponse.json(
        {
          success: false,
          message: "Lead allocation failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead created and assigned successfully",
      lead,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate lead for same phone and service",
        },
        { status: 409 },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
