import prisma from "./prisma";

export const databaseConnecting = async () => {
	try {
		await prisma.$connect();
		console.log("🚀 Prisma database connected successfully");
	} catch (err) {
		console.error("❌ Prisma database connection error:", err);
		process.exit(1);
	}
};

export const databaseDisconnecting = async () => {
	try {
		await prisma.$disconnect();
		console.log("🛑 Prisma database disconnected successfully");
	} catch (err) {
		console.error("❌ Prisma database disconnection error:", err);
	}
};

export const setupPrismaShutdownHooks = () => {
	const gracefulShutdown = async (signal: string) => {
		console.log(`⚠️ ${signal} received. Closing Prisma connection...`);
		await databaseDisconnecting();
		process.exit(0);
	};

	process.on("SIGINT", () => {
		void gracefulShutdown("SIGINT");
	});

	process.on("SIGTERM", () => {
		void gracefulShutdown("SIGTERM");
	});
};


