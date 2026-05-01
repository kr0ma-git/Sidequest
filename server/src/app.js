import express from "express";
import jobRouter from "./routes/job.router.js";

const app = express();

app.use(express.json());

app.use("/api/v1/jobs", jobRouter);

export default app;