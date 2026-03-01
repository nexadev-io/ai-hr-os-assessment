import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   

    if (req.user && req?.user?.id) {
      req.body.user = req.body.user || req.user?.id; 
      req.body.admin = req.body.admin || req.user?.id; 
    }

    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      
      throw error;
    }
  });
};

export default validateRequest;


