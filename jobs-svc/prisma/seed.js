"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcryptjs_1.default.hash("Admin@12345", 10);
    const userPassword = await bcryptjs_1.default.hash("User@12345", 10);
    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            name: "System Admin",
            role: client_1.Role.ADMIN,
            email: "admin@example.com",
            password: adminPassword,
            phone: "01710000000",
            status: client_1.UserStatus.ACTIVE,
            emailVerified: true,
        },
    });
    await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            name: "Demo User",
            role: client_1.Role.USER,
            email: "user@example.com",
            password: userPassword,
            phone: "01710000001",
            status: client_1.UserStatus.ACTIVE,
            emailVerified: true,
        },
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
