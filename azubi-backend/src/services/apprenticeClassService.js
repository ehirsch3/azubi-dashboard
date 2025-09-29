// services/apprenticeClassService.js
import { query } from "../db.js";

// CRUD für apprentice_classes

// services/apprenticeClassService.js
export const getAllClasses = async () => {
  const sql = "SELECT *  FROM apprentice_classes ORDER BY class_name;";
  const result = await query(sql);
  return result.rows;
};

// Eine Klasse nach ID abrufen
export const getClassById = async (id) => {
  const sql = "SELECT * FROM apprentice_classes WHERE id = $1;";
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

// Neue Klasse erstellen
export const createClass = async (class_name) => {
  const sql =
    "INSERT INTO apprentice_classes (class_name) VALUES ($1) RETURNING *;";
  const result = await query(sql, [class_name]);
  return result.rows[0];
};

// Klasse aktualisieren
export const updateClass = async (id, class_name) => {
  const sql =
    "UPDATE apprentice_classes SET class_name = $1 WHERE id = $2 RETURNING *;";
  const result = await query(sql, [class_name, id]);
  return result.rows[0] || null;
};

// Klasse löschen
export const deleteClass = async (id) => {
  const sql = "DELETE FROM apprentice_classes WHERE id = $1;";
  await query(sql, [id]);
};

export const assignClassToApprentice = async (id_person, id_class) => {
  const sql = `
    INSERT INTO apprentice_classes_z (id_person, id_class)
    VALUES ($1, $2)
    ON CONFLICT (id_person) 
    DO UPDATE SET id_class = EXCLUDED.id_class;  -- Updates id_class if id_person exists
  `;
  try {
    await query(sql, [id_person, id_class]); // Execute query
  } catch (err) {
    console.error("Fehler beim Zuweisen der Klasse:", err);
    throw err; // Rethrow error for controller to handle
  }
};

// Azubi von einer Klasse abmelden
export const removeClassFromApprentice = async (id_person) => {
  const sql = "DELETE FROM apprentice_classes_z WHERE id_person = $1;";
  await query(sql, [id_person]);
};

export const getApprenticesForAssignment = async () => {
  const sql = `
    SELECT 
      p.firstname, 
      p.lastname, 
      m.id_person,
      ac.class_name
    FROM 
      person p
    INNER JOIN 
      mpsworker m
    ON 
      p.id = m.id_person
    LEFT JOIN 
      apprentice_classes_z acz
    ON 
      m.id_person = acz.id_person
    LEFT JOIN 
      apprentice_classes ac
    ON 
      acz.id_class = ac.id
    WHERE 
      p.active = true 
      AND m.apprentice = true
      AND m.id_person NOT IN (6640, 32, 360, 389, 397, 845, 1958, 1990, 3481, 5827, 6425, 6701, 6831, 6832, 7131, 7187, 7259, 7330, 7870, 8475, 8513, 8651, 9102);
  `;

  const result = await query(sql);
  return result.rows; // Return the apprentices with their class names
};

export const getClassByPersonId = async (id_person) => {
  const sql = `
    SELECT ac.id, ac.class_name
    FROM apprentice_classes_z acz
    INNER JOIN apprentice_classes ac ON acz.id_class = ac.id
    WHERE acz.id_person = $1;
  `;
  const result = await query(sql, [id_person]);
  return result.rows[0] || null;
};
