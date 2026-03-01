import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import { forbidden, notFound, unauthorized } from "../utils/errorfunc";
import prisma from "../config/prisma";

const authorization = (...requiredRoles: string[]) => {
  
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw unauthorized("Please login!");
    }

    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    } catch (error) {
      throw forbidden("Invalid or expired token");
    }
    const { email } = decoded;

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        role: true,
        email: true,
        id: true,
        tenantId: true,
        emailVerified: true,
        isDeleted: true,
        status: true,
      },
    });
 

    if (!user) {
      throw notFound("User not found!");
    }

    if (user.emailVerified === false) {
      throw forbidden("You are not verified");
    }

    // Check user status
    if (user.status === "BLOCK") {
      throw forbidden("The user has been blocked!");
    }

    if (user.status !== "ACTIVE") {
      throw forbidden("The user has been blocked!");
    }
    if (user.isDeleted === true) {
      throw forbidden("This user deleted!");
    }

    

    if (
      requiredRoles && 
      !requiredRoles.includes(String(user.role))
    ) {
      throw unauthorized("You are not authorized a!");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      userId: user.id,
      tenantId: user.tenantId,
    };

    next();
  });
};

export default authorization;
