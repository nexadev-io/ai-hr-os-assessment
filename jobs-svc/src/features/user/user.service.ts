import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user) return user;

  return {
    _id: user.id,
    role: user.role,
    email: user.email, 
    status: user.status,
  };
};
 

export const userService = {
  getMe
};
