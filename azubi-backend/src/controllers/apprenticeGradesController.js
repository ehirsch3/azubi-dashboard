import * as apprenticeGradesService from "../services/apprenticeGradesService.js";

export const getAllGrades = async (req, res) => {
  try {
    const grades = await apprenticeGradesService.getAllGrades();
    res.json(grades);
  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllGradesForAdmin = async (req, res) => {
  try {
    const { id_person } = req.user; // Get the logged-in user's id_person

    // Check if the id_person matches the allowed admin IDs (123 or 321)
    if (![8682, 321].includes(Number(id_person))) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all grades for admin
    const grades = await apprenticeGradesService.getAllGrades();
    res.json(grades);
  } catch (err) {
    console.error("Error fetching all grades for admin:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGradesByUser = async (req, res) => {
  try {
    const { id_person } = req.user; // Retrieved from JWT
    const grades = await apprenticeGradesService.getGradesByUser(id_person);
    res.json(grades);
  } catch (err) {
    console.error("Error fetching user grades:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createGrade = async (req, res) => {
  try {
    const { id_subject, test_type, test_date, grade } = req.body;
    const { id_person } = req.user; // Retrieved from JWT

    if (!id_subject || !test_type || !test_date || grade < 1 || grade > 6) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const newGrade = await apprenticeGradesService.createGrade(
      id_person,
      id_subject,
      test_type,
      test_date,
      grade
    );

    res.status(201).json(newGrade);
  } catch (err) {
    console.error("Error creating grade:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, test_type, test_date, grade } = req.body;
    const { id_person } = req.user; // Retrieved from JWT

    const updatedGrade = await apprenticeGradesService.updateGrade(
      id,
      id_person,
      description,
      test_type,
      test_date,
      grade
    );

    if (!updatedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json(updatedGrade);
  } catch (err) {
    console.error("Error updating grade:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_person } = req.user;

    const success = await apprenticeGradesService.deleteGrade(id, id_person);

    if (!success) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    console.error("Error deleting grade:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllApprenticesWithGrades = async (req, res) => {
  try {
    const { id_person } = req.user; // Get the logged-in user's id_person

    // Check if the user is an admin
    if (![8682, 321].includes(Number(id_person))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const apprentices = await apprenticeGradesService.getAzubisWithGrades();
    res.json(apprentices);
  } catch (err) {
    console.error("Error fetching apprentices with grades:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSubjectsByUser = async (req, res) => {
  try {
    const { id_person } = req.user; // Retrieved from JWT
    const subjects = await apprenticeGradesService.getSubjectsByUser(id_person);
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects for user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
