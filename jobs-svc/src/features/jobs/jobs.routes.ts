import { Router } from "express";
import { jobsController } from "./jobs.controller";
import authorization from "../../middleware/authorization";

const router = Router();

router.post("/", authorization("USER"), jobsController.createJob);
router.get("/tenant", authorization("USER", "ADMIN"), jobsController.getAllJobsByTenantId);
router.get("/tenant/:id", authorization("USER", "ADMIN"), jobsController.getSingleJobByIdAndTenantId);
router.delete("/tenant/:id", authorization("USER", "ADMIN"), jobsController.deleteJobByIdAndTenantId);

export const jobsRoutes = router;
