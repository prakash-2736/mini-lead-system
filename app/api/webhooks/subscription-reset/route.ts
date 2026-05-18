import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { WebhookEvent } from "@/models/WebhookEvent";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const eventKey = req.headers.get("x-event-key");

    if (!eventKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing event key",
        },
        { status: 400 },
      );
    }

    const existingEvent = await WebhookEvent.findOne({
      eventKey,
    });

    if (existingEvent) {
      return NextResponse.json({
        success: true,
        message: "Webhook already processed",
      });
    }

    await Provider.updateMany(
      {},
      {
        quotaRemaining: 10,
      },
    );

    await WebhookEvent.create({
      eventKey,
    });

    return NextResponse.json({
      success: true,
      message: "Quotas reset successfully",
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
