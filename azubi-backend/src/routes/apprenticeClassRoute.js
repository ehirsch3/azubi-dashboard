// routes/apprenticeClassRoutes.js
import express from "express";
import * as apprenticeClassController from "../controllers/apprenticeClassController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD für Klassen
router.get(
  "/classes",
  authenticateJWT,
  apprenticeClassController.getAllClasses
);
router.get(
  "/classes/:id",
  authenticateJWT,
  apprenticeClassController.getClassById
);
router.post("/classes", authenticateJWT, apprenticeClassController.createClass);
router.put(
  "/classes/:id",
  authenticateJWT,
  apprenticeClassController.updateClass
);
router.delete(
  "/classes/:id",
  authenticateJWT,
  apprenticeClassController.deleteClass
);

// Azubi einer Klasse zuweisen
router.post(
  "/assign-class",
  authenticateJWT,
  apprenticeClassController.assignClassToApprentice
);

// Azubi von einer Klasse abmelden
router.post(
  "/remove-class",
  authenticateJWT,
  apprenticeClassController.removeClassFromApprentice
);

router.get(
  "/apprentices",
  authenticateJWT,
  apprenticeClassController.getApprenticesForAssignment
);

export default router;
