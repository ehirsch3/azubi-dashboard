import { query } from "../db.js";

// CRUD für apprentice_subjects

// Alle Fächer abrufen
export const getAllSubjects = async () => {
  const sql = "SELECT * FROM apprentice_subjects ORDER BY subject_name;";
  const result = await query(sql);
  return result.rows;
};

// Ein Fach nach ID abrufen
export const getSubjectById = async (id) => {
  const sql = "SELECT * FROM apprentice_subjects WHERE id = $1;";
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

// Neues Fach erstellen
export const createSubject = async (subject_name) => {
  const sql =
    "INSERT INTO apprentice_subjects (subject_name) VALUES ($1) RETURNING *;";
  const result = await query(sql, [subject_name]);
  return result.rows[0];
};

// Fach aktualisieren
export const updateSubject = async (id, subject_name) => {
  const sql =
    "UPDATE apprentice_subjects SET subject_name = $1 WHERE id = $2 RETURNING *;";
  const result = await query(sql, [subject_name, id]);
  return result.rows[0] || null;
};

// Fach löschen
export const deleteSubject = async (id) => {
  const sql = "DELETE FROM apprentice_subjects WHERE id = $1;";
  await query(sql, [id]);
};

export const assignSubjectToApprentice = async (id_person, id_subjects) => {
  // Ensure id_person and id_subjects are arrays in PostgreSQL format
  if (!Array.isArray(id_person)) {
    id_person = [id_person];
  }

  if (!Array.isArray(id_subjects)) {
    id_subjects = [id_subjects];
  }

  // Log to check the values before running the query
  console.log("id_person:", id_person);
  console.log("id_subjects:", id_subjects);

  // Validate that id_person and id_subjects are not empty
  if (id_person.length === 0 || id_subjects.length === 0) {
    throw new Error("id_person and id_subjects cannot be empty");
  }

  // Loop over each subject and insert a row for each (id_person, id_subject) pair
  for (const personId of id_person) {
    for (const subjectId of id_subjects) {
      const sql = `
          INSERT INTO apprentice_subjects_z (id_person, id_subject)
          VALUES ($1, $2)
          ON CONFLICT (id_person, id_subject) DO NOTHING;
        `;

      try {
        // Execute the query for each (id_person, id_subject) pair
        await query(sql, [personId, subjectId]);
      } catch (err) {
        console.error("Fehler beim Zuweisen der Fächer:", err);
        throw err;
      }
    }
  }
};

export const removeSubjectFromApprentice = async (id_person, id_subjects) => {
  const sql = `
      DELETE FROM apprentice_subjects_z
WHERE id_person = ANY($1::int[]) 
AND id_subject = ANY($2::int[]);

    `;
  try {
    await query(sql, [id_person, id_subjects]);
  } catch (err) {
    console.error("Fehler beim Entfernen der Fächer:", err);
    throw err;
  }
};

// Alle Azubis und ihre Fächer für die Zuweisung abrufen
export const getApprenticesForSubjectAssignment = async () => {
  const sql = `
    SELECT 
      p.firstname, 
      p.lastname, 
      m.id_person,
      array_agg(asub.subject_name) AS subjects
    FROM 
      person p
    INNER JOIN 
      mpsworker m
    ON 
      p.id = m.id_person
    LEFT JOIN 
      apprentice_subjects_z asz
    ON 
      m.id_person = asz.id_person
    LEFT JOIN 
      apprentice_subjects asub
    ON 
      asz.id_subject = asub.id
    WHERE 
      p.active = true 
      AND m.apprentice = true
    GROUP BY 
      m.id_person, p.firstname, p.lastname;
  `;
  const result = await query(sql);
  return result.rows;
};
