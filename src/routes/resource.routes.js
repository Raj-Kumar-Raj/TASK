import express from "express";
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";
import {
  validateResource,
  resourceSchema,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, validateResource(resourceSchema), createResource)
  .get(protect, getAllResources);

router
  .route("/:id")
  .get(protect, getResourceById)
  .put(protect, admin, validateResource(resourceSchema), updateResource)
  .delete(protect, admin, deleteResource);

export default router;
