import * as apprenticeSubjectService from "../services/apprenticeSubjectService.js";

// Alle Fächer abrufen
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await apprenticeSubjectService.getAllSubjects();
    res.json(subjects);
  } catch (err) {
    console.error("Fehler beim Abrufen der Fächer:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Ein Fach nach ID abrufen
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await apprenticeSubjectService.getSubjectById(id);
    if (!subject) {
      return res.status(404).json({ message: "Fach nicht gefunden" });
    }
    res.json(subject);
  } catch (err) {
    console.error("Fehler beim Abrufen des Fachs:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Neues Fach erstellen
export const createSubject = async (req, res) => {
  try {
    const { subject_name } = req.body;
    const newSubject = await apprenticeSubjectService.createSubject(
      subject_name
    );
    res.status(201).json(newSubject);
  } catch (err) {
    console.error("Fehler beim Erstellen des Fachs:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Fach aktualisieren
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name } = req.body;
    const updatedSubject = await apprenticeSubjectService.updateSubject(
      id,
      subject_name
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Fach nicht gefunden" });
    }

    res.json(updatedSubject);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Fachs:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Fach löschen
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await apprenticeSubjectService.deleteSubject(id);
    res.json({ message: "Fach erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen des Fachs:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

export const assignSubjectToApprentice = async (req, res) => {
  try {
    const { id_person, id_subjects } = req.body;
    if (!id_person || !Array.isArray(id_subjects) || id_subjects.length === 0) {
      return res.status(400).json({
        message:
          "Fehlende Parameter: id_person oder id_subjects (Array mit Fach-IDs)",
      });
    }
    console.log("Received:", { id_person, id_subjects });
    await apprenticeSubjectService.assignSubjectToApprentice(
      id_person,
      id_subjects
    );
    res.json({ message: "Azubi erfolgreich den Fächern zugewiesen!" });
  } catch (err) {
    console.error("Fehler beim Zuweisen der Fächer:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Azubi von einem Fach abmelden (mit IDs in der URL)
export const removeSubjectFromApprentice = async (req, res) => {
  try {
    const { id_person, id_subjects } = req.body;
    if (!id_person || !Array.isArray(id_subjects) || id_subjects.length === 0) {
      return res.status(400).json({
        message:
          "Fehlende Parameter: id_person oder id_subjects (Array mit Fach-IDs)",
      });
    }
    console.log("Received:", { id_person, id_subjects });
    await apprenticeSubjectService.removeSubjectFromApprentice(
      id_person,
      id_subjects
    );
    res.json({ message: "Fächer erfolgreich vom Azubi entfernt!" });
  } catch (err) {
    console.error("Fehler beim Entfernen der Fächer:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Azubis für Fachzuweisung abrufen
export const getApprenticesForSubjectAssignment = async (req, res) => {
  try {
    const apprentices =
      await apprenticeSubjectService.getApprenticesForSubjectAssignment();
    res.json(apprentices);
  } catch (error) {
    console.error("Fehler beim Abrufen der Azubis für Fachzuweisung:", error);
    res.status(500).json({ error: error.message });
  }
};
