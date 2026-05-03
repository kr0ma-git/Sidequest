import { Router } from "express";
import {
    userSignUp,
    checkIfExistingEmail,
    //userLogin,
} from "../controller/auth.controller.js";

const router = Router();

// POST
router.route("/signUp").post(userSignUp);
// GET
router.route("/checkEmail/:email").get(checkIfExistingEmail);
//router.route("/login").post(userLogin);

export default router;