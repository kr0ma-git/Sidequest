import { Router } from "express";
import {
    fetchAllJobs,
    createJob,
    fetchPostedByUser,
    fetchAcceptedByUser,
} from "../controller/job.controller.js";

const router = Router();

// GET
router.route("/").get(fetchAllJobs);
router.route("/posted/:userId").get(fetchPostedByUser);
router.route("/accepted/:userId").get(fetchAcceptedByUser);
// POST
router.route("/createJob").post(createJob);

export default router;