import { seedDatabase } from "./src/server/seed";

console.log("Forcing seed execution...");
seedDatabase().then(() => {
  console.log("Seed complete.");
  process.exit(0);
}).catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
