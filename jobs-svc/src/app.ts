import express from "express";
import cors from "cors";
import { authRoute } from "./features/auth/auth.routes";
import { userRoutes } from "./features/user/user.router";
import { jobsRoutes } from "./features/jobs/jobs.routes";

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/v1/auth", authRoute); 
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobsRoutes);


app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy 🚀" });
});

export default app;
