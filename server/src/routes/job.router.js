import { Router } from "express";
import {
    fetchAllJobs,
    createJob,
} from "../controller/job.controller.js";

const router = Router();

// GET
router.route("/").get(fetchAllJobs);
// POST
router.route("/createJob").post(createJob);

export default router;