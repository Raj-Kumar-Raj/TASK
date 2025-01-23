import express from "express";
import {
  register,
  login,
  createAdmin,
} from "../controllers/auth.controller.js";
import {
  validateResource,
  userSchema,
  adminSchema,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/register", validateResource(userSchema), register);
router.post("/login", validateResource(userSchema), login);
router.post("/create-admin", validateResource(adminSchema), createAdmin);

export default router;
