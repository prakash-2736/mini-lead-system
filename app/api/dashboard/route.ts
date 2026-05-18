import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { LeadAssignment } from "@/models/LeadAssignment";

export async function GET() {
  try {
    await connectDB();

    const providers = await Provider.find({}).lean();

    const dashboardData = await Promise.all(
      providers.map(async (provider) => {
        const assignments = await LeadAssignment.find({
          providerId: provider._id,
        })
          .populate({
            path: "leadId",
            populate: {
              path: "serviceId",
            },
          })
          .lean();

        return {
          _id: provider._id,
          name: provider.name,
          monthlyQuota: provider.monthlyQuota,
          quotaRemaining: provider.quotaRemaining,
          leadsReceived: assignments.length,
          assignedLeads: assignments,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      providers: dashboardData,
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
