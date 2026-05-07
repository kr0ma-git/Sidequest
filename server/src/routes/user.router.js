import { Router } from "express";
import { fetchUserProfile } from "../controller/user.controller.js";

const router = Router();

// GET
router.route("/profile").get(fetchUserProfile);

export default router;