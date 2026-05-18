import mongoose from "mongoose";
import { Lead } from "@/models/Lead";
import { Provider } from "@/models/Provider";
import { LeadAssignment } from "@/models/LeadAssignment";
import { RoundRobinState } from "@/models/RoundRobinState";
import { Service } from "@/models/Service";

const RULES = {
  "Service 1": {
    mandatory: ["Provider 1"],
    pool: ["Provider 2", "Provider 3", "Provider 4"],
  },
  "Service 2": {
    mandatory: ["Provider 5"],
    pool: ["Provider 6", "Provider 7", "Provider 8"],
  },
  "Service 3": {
    mandatory: ["Provider 1", "Provider 4"],
    pool: [
      "Provider 2",
      "Provider 3",
      "Provider 5",
      "Provider 6",
      "Provider 7",
      "Provider 8",
    ],
  },
};

export async function allocateLead(leadId: string) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const lead = await Lead.findById(leadId).session(session);

    if (!lead) {
      throw new Error("Lead not found");
    }

    const service = await Service.findById(lead.serviceId).session(session);

    if (!service) {
      throw new Error("Service not found");
    }

    const rule = RULES[service.name as keyof typeof RULES];

    if (!rule) {
      throw new Error("Allocation rule missing");
    }

    const assignedProviderIds = new Set<string>();

    // Mandatory providers
    const mandatoryProviders = await Provider.find({
      name: { $in: rule.mandatory },
      quotaRemaining: { $gt: 0 },
    }).session(session);

    for (const provider of mandatoryProviders) {
      await LeadAssignment.create(
        [
          {
            leadId: lead._id,
            providerId: provider._id,
          },
        ],
        { session },
      );

      provider.quotaRemaining -= 1;
      await provider.save({ session });

      assignedProviderIds.add(provider._id.toString());
    }

    const remainingSlots = 3 - assignedProviderIds.size;

    if (remainingSlots <= 0) {
      await session.commitTransaction();
      return;
    }

    const rrState = await RoundRobinState.findOne({
      serviceId: service._id,
    }).session(session);

    if (!rrState) {
      throw new Error("Round robin state missing");
    }

    const poolProviders = await Provider.find({
      name: { $in: rule.pool },
      quotaRemaining: { $gt: 0 },
    }).session(session);

    const sortedPool = rule.pool
      .map((name) => {
        return poolProviders.find((p) => p.name.toString() === name);
      })
      .filter((p) => p != null);

    let cursor = rrState.cursorIndex;
    let assignedCount = 0;
    let attempts = 0;

    while (assignedCount < remainingSlots && attempts < sortedPool.length) {
      const provider = sortedPool[cursor % sortedPool.length];

      if (provider && !assignedProviderIds.has(provider._id.toString())) {
        await LeadAssignment.create(
          [
            {
              leadId: lead._id,
              providerId: provider._id,
            },
          ],
          { session },
        );

        provider.quotaRemaining -= 1;
        await provider.save({ session });

        assignedProviderIds.add(provider._id.toString());
        assignedCount++;
      }

      cursor++;
      attempts++;
    }

    rrState.cursorIndex = cursor % sortedPool.length;
    await rrState.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
