import dotenv from "dotenv";
import app from "./app";
import { databaseConnecting, setupPrismaShutdownHooks } from "./config/db";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await databaseConnecting();
    setupPrismaShutdownHooks();

    app.listen(PORT, () => { 
      console.log(`🩺 Health Check URL: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
