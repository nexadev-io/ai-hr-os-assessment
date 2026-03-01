import config from "../config";
import jwt from "jsonwebtoken";


const JWT_SECRET = config.jwt_secret as string;


export const generateToken = (
  user: { id?: string; email?: string; role?: string },
  expiresIn: number | any
) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      id: user.id
    },
    JWT_SECRET,
    { expiresIn }
  );
};
