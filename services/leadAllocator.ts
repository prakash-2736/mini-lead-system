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

async function reserveProvider(
  providerName: string,
  leadId: string,
  assignedSet: Set<string>,
  session: mongoose.ClientSession,
) {
  const provider = await Provider.findOneAndUpdate(
    {
      name: providerName,
      quotaRemaining: { $gt: 0 },
    },
    {
      $inc: { quotaRemaining: -1 },
    },
    {
      new: true,
      session,
    },
  );

  if (!provider) {
    return false;
  }

  if (assignedSet.has(provider._id.toString())) {
    return false;
  }

  await LeadAssignment.create(
    [
      {
        leadId,
        providerId: provider._id,
      },
    ],
    { session },
  );

  assignedSet.add(provider._id.toString());

  return true;
}

export async function allocateLead(leadId: string) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
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
        throw new Error("Rule missing");
      }

      const assignedSet = new Set<string>();

      // mandatory
      for (const providerName of rule.mandatory) {
        await reserveProvider(providerName, leadId, assignedSet, session);
      }

      const remainingSlots = 3 - assignedSet.size;

      if (remainingSlots <= 0) {
        return;
      }

      const rrState = await RoundRobinState.findOne({
        serviceId: service._id,
      }).session(session);

      if (!rrState) {
        throw new Error("Round robin state missing");
      }

      let cursor = rrState.cursorIndex;
      let assignedCount = 0;
      let checked = 0;

      while (assignedCount < remainingSlots && checked < rule.pool.length) {
        const providerName = rule.pool[cursor % rule.pool.length];

        const success = await reserveProvider(
          providerName,
          leadId,
          assignedSet,
          session,
        );

        if (success) {
          assignedCount++;
        }

        cursor++;
        checked++;
      }

      rrState.cursorIndex = cursor % rule.pool.length;
      await rrState.save({ session });
    });
  } finally {
    session.endSession();
  }
}
