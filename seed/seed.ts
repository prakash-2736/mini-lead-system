import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { Provider } from "@/models/Provider";
import { RoundRobinState } from "@/models/RoundRobinState";

async function seed() {
  try {
    await connectDB();

    console.log("Connected to DB");

    // Clear old data (safe during development)
    await Service.deleteMany({});
    await Provider.deleteMany({});
    await RoundRobinState.deleteMany({});

    // Services
    const services = await Service.insertMany([
      { name: "Service 1" },
      { name: "Service 2" },
      { name: "Service 3" },
    ]);

    console.log("Services created");

    // Providers
    const providers = [];

    for (let i = 1; i <= 8; i++) {
      providers.push({
        name: `Provider ${i}`,
        monthlyQuota: 10,
        quotaRemaining: 10,
      });
    }

    await Provider.insertMany(providers);

    console.log("Providers created");

    // Round robin states
    await RoundRobinState.insertMany([
      {
        serviceId: services[0]._id,
        cursorIndex: 0,
      },
      {
        serviceId: services[1]._id,
        cursorIndex: 0,
      },
      {
        serviceId: services[2]._id,
        cursorIndex: 0,
      },
    ]);

    console.log("Round robin states created");
    console.log("SEED COMPLETE");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
