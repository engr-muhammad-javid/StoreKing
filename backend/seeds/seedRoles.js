// seedRoles.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../model/role.model.js"; // Adjust path as needed

dotenv.config(); // Load MongoDB URI from .env

const MONGO_URI = process.env.DB_STRING || "mongodb://localhost:27017/yourdbname";

const rolesToSeed = [
  {
    name: "Admin",
    permissions: [
      { page: "dashboard", create: true, update: true, delete: true, view: true },
      { page: "users", create: true, update: true, delete: true, view: true },
      { page: "roles", create: true, update: true, delete: true, view: true },
    ]
  },
  {
    name: "Customer",
    permissions: [
      { page: "products", view: true },
      { page: "orders", view: true },
    ]
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB");

    for (const roleData of rolesToSeed) {
      const existing = await Role.findOne({ name: roleData.name });

      if (!existing) {
        await Role.create(roleData);
        console.log(`✅ Role '${roleData.name}' created.`);
      } else {
        console.log(`ℹ️  Role '${roleData.name}' already exists.`);
      }
    }

    console.log("✅ Role seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedRoles();
