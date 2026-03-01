import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { forbidden, notFound } from "../utils/errorfunc";
import prisma from "../config/prisma";

const authentication = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email; 
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        role: true,
        email: true,
        password: true, 
        id: true,
        emailVerified: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        status: true, 
      },
    });

    if (!user) {
      throw notFound("User not found!");
    }
    if (user.status === "BLOCK") {
      throw forbidden("The user has been blocked!");
    }

    if (user.emailVerified === false) {
      throw forbidden("You are not verified");
    }
    if (user.status !== "ACTIVE") {
      throw forbidden("The user has been blocked!");
    }
    if (user.isDeleted === true) {
      throw forbidden("This user deleted!");
    }
 

    next();
  });
};

export default authentication;
