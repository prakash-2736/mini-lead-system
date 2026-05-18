import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find({}).lean();

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
