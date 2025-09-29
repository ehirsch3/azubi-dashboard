import express from "express";
import * as reportController from "../controllers/apprenticeReportController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/reports", authenticateJWT, reportController.getAllReports); // Alle Berichte abrufen
router.get("/reports/:id", authenticateJWT, reportController.getReportById); // Einen Bericht abrufen
router.post("/reports", authenticateJWT, reportController.createReport); // Neuen Bericht erstellen
router.put("/reports/:id", authenticateJWT, reportController.updateReport); // Bericht und Tage aktualisieren
router.put(
  "/reports/:id/submit",
  authenticateJWT,
  reportController.submitReport
); // Bericht einreichen
router.put(
  "/reports/:id/approve",
  authenticateJWT,
  reportController.approveReport
); // Bericht genehmigen
router.delete("/reports/:id", authenticateJWT, reportController.deleteReport); // Bericht und Tage löschen
router.get(
  "/reports/used-weeks/:year",
  authenticateJWT,
  reportController.getUsedCalendarWeeks
);
router.put(
  "/reports/:id/decline",
  authenticateJWT,
  reportController.declineReport
);
router.get(
  "/subject-report",
  authenticateJWT,
  reportController.getSubjectsForReport
);

export default router;
