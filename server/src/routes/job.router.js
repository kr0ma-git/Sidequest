import { Router } from "express";
import {
    fetchAllJobs,
} from "../controller/job.controller.js";

const router = Router();

// GET
router.route("/").get(fetchAllJobs);

export default router;