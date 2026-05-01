import express from "express";
import jobRouter from "./routes/job.router.js";
import authRouter from "./routes/auth.router.js";

const app = express();

app.use(express.json());

app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/auth", authRouter);

export default app;