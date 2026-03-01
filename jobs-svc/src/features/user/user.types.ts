import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { 
    role: string; 
    email: string; 
    id: string; 
    userId: string;
    tenantId: string;
  };
} 
 