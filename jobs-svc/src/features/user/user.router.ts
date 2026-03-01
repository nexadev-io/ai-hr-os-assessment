import {  Router } from "express";


import { userController } from "./user.controller";
import authorization from "../../middleware/authorization";



const router = Router();
 
router.get(
  "/get-me",
  authorization("ADMIN", "USER"),
  userController.getMe
);

 

export const userRoutes = router;
