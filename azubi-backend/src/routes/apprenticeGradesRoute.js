import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import * as apprenticeGradesController from "../controllers/apprenticeGradesController.js";

const router = express.Router();

router.get("/grades", authenticateJWT, apprenticeGradesController.getAllGrades);
router.get(
  "/grades/my",
  authenticateJWT,
  apprenticeGradesController.getGradesByUser
);
router.post("/grades", authenticateJWT, apprenticeGradesController.createGrade);
router.put(
  "/grades/:id",
  authenticateJWT,
  apprenticeGradesController.updateGrade
);
router.delete(
  "/grades/:id",
  authenticateJWT,
  apprenticeGradesController.deleteGrade
);

router.get(
  "/grades/all",
  authenticateJWT,
  apprenticeGradesController.getAllApprenticesWithGrades
);

router.get(
  "/grades/subjects",
  authenticateJWT,
  apprenticeGradesController.getSubjectsByUser
);

export default router;
