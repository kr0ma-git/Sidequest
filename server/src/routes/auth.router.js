import { Router } from "express";
import {
    userSignUp,
    //userLogin,
} from "../controller/auth.controller.js";

const router = Router();

router.route("/signUp").post(userSignUp);
//router.route("/login").post(userLogin);

export default router;