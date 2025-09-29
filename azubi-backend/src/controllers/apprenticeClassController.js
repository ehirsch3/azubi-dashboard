// controllers/apprenticeClassController.js
import * as apprenticeClassService from "../services/apprenticeClassService.js";

export const getAllClasses = async (req, res) => {
  try {
    const classes = await apprenticeClassService.getAllClasses();
    res.json(classes); // Sending class data with class_name
  } catch (err) {
    console.error("Fehler beim Abrufen der Klassen:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Eine Klasse nach ID abrufen
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const _class = await apprenticeClassService.getClassById(id);

    if (!_class) {
      return res.status(404).json({ message: "Klasse nicht gefunden" });
    }

    res.json(_class);
  } catch (err) {
    console.error("Fehler beim Abrufen der Klasse:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Neue Klasse erstellen
export const createClass = async (req, res) => {
  try {
    const { class_name } = req.body;
    const newClass = await apprenticeClassService.createClass(class_name);
    res.status(201).json(newClass);
  } catch (err) {
    console.error("Fehler beim Erstellen der Klasse:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Klasse aktualisieren
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name } = req.body;
    const updatedClass = await apprenticeClassService.updateClass(
      id,
      class_name
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Klasse nicht gefunden" });
    }

    res.json(updatedClass);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Klasse:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Klasse löschen
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await apprenticeClassService.deleteClass(id);
    res.json({ message: "Klasse erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen der Klasse:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

export const assignClassToApprentice = async (req, res) => {
  try {
    const { id_person, id_class } = req.body;

    if (!id_person || !id_class) {
      return res.status(400).json({
        message: "Missing required parameters: id_person or id_class",
      });
    }

    await apprenticeClassService.assignClassToApprentice(id_person, id_class);

    res.json({ message: "Azubi erfolgreich der Klasse zugewiesen!" });
  } catch (err) {
    console.error("Fehler beim Zuweisen des Azubis zur Klasse:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

// Azubi von einer Klasse abmelden
export const removeClassFromApprentice = async (req, res) => {
  try {
    const { id_person } = req.body;
    await apprenticeClassService.removeClassFromApprentice(id_person);
    res.json({ message: "Azubi erfolgreich von der Klasse abgemeldet" });
  } catch (err) {
    console.error("Fehler beim Abmelden des Azubis von der Klasse:", err);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
};

export const getApprenticesForAssignment = async (req, res) => {
  try {
    const apprentices =
      await apprenticeClassService.getApprenticesForAssignment();
    res.json(apprentices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
