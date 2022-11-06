import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";
import { getProfile } from "../controllers/profileController.js";

router.route("/getProfile").post(getProfile);

export default router;
