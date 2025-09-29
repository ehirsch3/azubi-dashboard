import express from "express";
import * as apprenticeSubjectController from "../controllers/apprenticeSubjectController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD für Fächer
router.get(
  "/subjects",
  authenticateJWT,
  apprenticeSubjectController.getAllSubjects
);
router.get(
  "/subjects/:id",
  authenticateJWT,
  apprenticeSubjectController.getSubjectById
);
router.post(
  "/subjects",
  authenticateJWT,
  apprenticeSubjectController.createSubject
);
router.put(
  "/subjects/:id",
  authenticateJWT,
  apprenticeSubjectController.updateSubject
);
router.delete(
  "/subjects/:id",
  authenticateJWT,
  apprenticeSubjectController.deleteSubject
);

// Azubi mehrere Fächer zuweisen
router.post(
  "/assign-subject/",
  authenticateJWT,
  apprenticeSubjectController.assignSubjectToApprentice
);

// Azubi von einem Fach abmelden (mit den IDs in der URL)
router.post(
  "/remove-subject/",
  authenticateJWT,
  apprenticeSubjectController.removeSubjectFromApprentice
);

// Azubis für Fachzuweisung abrufen
router.get(
  "/apprentices",
  authenticateJWT,
  apprenticeSubjectController.getApprenticesForSubjectAssignment
);


export default router;
