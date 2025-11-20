require('dotenv').config();
const { execSync } = require('child_process');

try {
  console.log("🌿 Using DATABASE_URL:", process.env.DATABASE_URL);
  execSync('npx prisma db push', { stdio: 'inherit' });
} catch (error) {
  console.error("❌ Prisma push failed:", error);
}
