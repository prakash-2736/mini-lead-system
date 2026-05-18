import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { Lead } from "@/models/Lead";
import { allocateLead } from "@/services/leadAllocator";

export async function POST() {
  try {
    await connectDB();

    const service = await Service.findOne({
      name: "Service 1",
    });

    if (!service) {
      throw new Error("Service not found");
    }

    const jobs = [];

    for (let i = 0; i < 10; i++) {
      jobs.push(
        (async () => {
          const lead = await Lead.create({
            name: `Concurrent User ${i}`,
            phone: `91${Date.now()}${i}`,
            city: "Concurrency City",
            description: "Parallel concurrency test",
            serviceId: service._id,
          });

          await allocateLead(lead._id.toString());
        })(),
      );
    }

    await Promise.all(jobs);

    return NextResponse.json({
      success: true,
      message: "10 concurrent leads generated",
    });
  } catch (error: any) {
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
