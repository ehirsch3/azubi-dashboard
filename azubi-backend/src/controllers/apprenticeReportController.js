import * as reportService from "../services/apprenticeReportService.js";
import * as apprenticeClassService from "../services/apprenticeClassService.js";

// Alle Berichte abrufen
export const getAllReports = async (req, res) => {
  try {
    const reports = await reportService.getAllReports();
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Abrufen der Berichte" });
  }
};

// Einen einzelnen Bericht abrufen (inkl. Tage)
export const getReportById = async (req, res) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Bericht nicht gefunden" });
    }

    // Hole die Tage für den Bericht
    const reportDays = await reportService.getReportDaysByReportId(
      req.params.id
    );
    res.json({ ...report, days: reportDays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Abrufen des Berichts" });
  }
};

// Neuen Bericht erstellen (inkl. Tage)
export const createReport = async (req, res) => {
  try {
    const { calendar_week, year, content, days, school_content } = req.body;
    const id_person = req.user.id_person;

    if (!id_person) {
      return res.status(403).json({ message: "Nicht autorisiert" });
    }

    // Get the current class snapshot for the apprentice
    const currentClass = await apprenticeClassService.getClassByPersonId(
      id_person
    );
    const class_id_snapshot = currentClass ? currentClass.id : null;
    const class_name_snapshot = currentClass ? currentClass.class_name : null;

    // Create the report including snapshot data
    const newReport = await reportService.createReport(
      id_person,
      calendar_week,
      year,
      content,
      class_id_snapshot,
      class_name_snapshot,
      school_content
    );

    // Create the report days
    for (const day of days) {
      await reportService.createReportDay(
        newReport.report_id,
        day.day_of_week,
        day.type
      );
    }

    res.status(201).json({
      message: "Report und Tage erfolgreich erstellt",
      report_id: newReport.report_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Erstellen des Berichts" });
  }
};

// Bericht und Tage aktualisieren
export const updateReport = async (req, res) => {
  const report = req.body;
  console.log("Controller Boss", req.body);
  try {
    let create = true;

    for (const day of report.days) {
      if (day.type === "Berufsschultag") {
        create = false;
      }
    }

    if (create) {
      report.school_content = "";
    }

    const updatedReport = await reportService.updateReport(report);
    if (!updatedReport) {
      return res.status(404).json({ message: "Bericht nicht gefunden" });
    }

    // Lösche die bestehenden Tage und erstelle neue
    await reportService.deleteReportDaysByReportId(report.id);

    for (const day of report.days) {
      await reportService.createReportDay(report.id, day.day_of_week, day.type);
    }

    res.json({
      message: "Bericht und Tage erfolgreich aktualisiert",
      report: updatedReport,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Aktualisieren des Berichts" });
  }
};

// Bericht zur Genehmigung einreichen
export const submitReport = async (req, res) => {
  try {
    const submittedReport = await reportService.submitReport(req.params.id);
    res.json(submittedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Einreichen des Berichts" });
  }
};

// Bericht genehmigen
export const approveReport = async (req, res) => {
  const { id_person } = req.user;
  try {
    const approvedReport = await reportService.approveReport(
      req.params.id,
      id_person
    );
    res.json(approvedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Genehmigen des Berichts" });
  }
};

// Bericht und Tage löschen
export const deleteReport = async (req, res) => {
  try {
    // Lösche die Tage zuerst
    await reportService.deleteReportDaysByReportId(req.params.id);

    // Lösche den Bericht
    const deletedReport = await reportService.deleteReport(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Bericht nicht gefunden" });
    }
    res.json({ message: "Bericht und zugehörige Tage erfolgreich gelöscht" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Löschen des Berichts" });
  }
};

export const getUsedCalendarWeeks = async (req, res) => {
  const { year } = req.params;
  try {
    const usedWeeks = await reportService.getUsedCalendarWeeks(year);
    res.json(usedWeeks);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der verwendeten Kalenderwochen" });
  }
};

export const declineReport = async (req, res) => {
  try {
    const { id } = req.params;
    let deny_message = req.body.deny_message;
    if (!deny_message) {
      deny_message = "";
    }
    const updatedReport = await reportService.declineReport(id, deny_message);

    if (!updatedReport) {
      return res.status(404).json({ message: "Bericht nicht gefunden" });
    }

    res.json(updatedReport);
  } catch (err) {
    console.error("Fehler beim Ablehnen des Berichts:", err);
    res.status(500).json({ message: "Fehler beim Ablehnen des Berichts" });
  }
};

export const getSubjectsForReport = async (req, res) => {
  try {
    const { id_person } = req.user;
    const subjects = await reportService.getSubjectsForReport(id_person);
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects for report:", error);
    res.status(500).json({ error: error.message });
  }
};
