import { Router } from "express";
import { jobsController } from "./jobs.controller";
import authorization from "../../middleware/authorization";

const router = Router();

router.post("/", authorization("USER"), jobsController.createJob);

export const jobsRoutes = router;
