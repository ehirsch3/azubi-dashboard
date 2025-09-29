import { query } from "../db.js";

// Get all grades with snapshot or fallback to current class
export const getAllGrades = async () => {
  const result = await query(
    `SELECT 
       g.*, 
       COALESCE(g.class_name_snapshot, ac.class_name) AS class_name
     FROM apprentice_grades g
     LEFT JOIN apprentice_classes_z acz ON g.id_person = acz.id_person
     LEFT JOIN apprentice_classes ac ON acz.id_class = ac.id
     ORDER BY g.test_date DESC`
  );
  return result.rows;
};

export const getGradesByUser = async (id_person) => {
  const result = await query(
    "SELECT * FROM apprentice_grades WHERE id_person = $1 ORDER BY test_date DESC",
    [id_person]
  );
  return result.rows;
};

// Create a new grade entry and snapshot the current class (if available)
export const createGrade = async (
  id_person,
  id_subject, // This is used instead of description
  test_type,
  test_date,
  grade
) => {
  const classSnapshotQuery = `
    SELECT ac.class_name
    FROM apprentice_classes_z acz
    JOIN apprentice_classes ac ON acz.id_class = ac.id
    WHERE acz.id_person = $1
    LIMIT 1;
  `;
  const snapshotResult = await query(classSnapshotQuery, [id_person]);
  const class_name_snapshot =
    snapshotResult.rows.length > 0 ? snapshotResult.rows[0].class_name : null;

  const result = await query(
    `INSERT INTO apprentice_grades 
       (id_person, id_subject, test_type, test_date, grade, class_name_snapshot)
     VALUES 
       ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id_person, id_subject, test_type, test_date, grade, class_name_snapshot]
  );
  return result.rows[0];
};

export const updateGrade = async (
  id,
  id_person,
  test_type,
  test_date,
  grade
) => {
  const result = await query(
    `UPDATE apprentice_grades
     SET test_type = $1, test_date = $2, grade = $3
     WHERE id = $4 AND id_person = $5
     RETURNING *`,
    [test_type, test_date, grade, id, id_person]
  );
  return result.rows[0] || null;
};

export const deleteGrade = async (id, id_person) => {
  const result = await query(
    "DELETE FROM apprentice_grades WHERE id = $1 AND id_person = $2",
    [id, id_person]
  );
  return result.rowCount > 0;
};

export const getAzubisWithGrades = async () => {
  const queryText = `
    SELECT 
      p.firstname, 
      p.lastname, 
      m.id_person, 
      ag.id AS grade_id, 
      asub.subject_name, 
      ag.test_type, 
      ag.test_date, 
      ag.grade,
      ag.class_name_snapshot
    FROM 
      person p
    INNER JOIN 
      mpsworker m ON p.id = m.id_person
    LEFT JOIN 
      apprentice_grades ag ON m.id_person = ag.id_person
    LEFT JOIN 
      apprentice_subjects asub ON ag.id_subject = asub.id
    WHERE 
      m.apprentice = true
      AND p.active = true
      AND m.id_person NOT IN (6640, 32, 360, 389, 397, 845, 1958, 1990, 3481, 5827, 6425, 6701, 6831, 6832, 7131, 7187, 7259, 7330, 7870, 8475, 8513, 8651, 9102)
    ORDER BY 
      p.lastname, p.firstname, ag.test_date DESC;
  `;

  const result = await query(queryText);

  // Group the result by id_person to structure the data as an array of apprentices with nested grades
  const apprentices = result.rows.reduce((acc, row) => {
    let apprentice = acc.find((a) => a.id_person === row.id_person);
    if (!apprentice) {
      apprentice = {
        id_person: row.id_person,
        name: `${row.firstname} ${row.lastname}`,
        grades: [],
      };
      acc.push(apprentice);
    }
    if (row.grade_id) {
      apprentice.grades.push({
        id: row.grade_id,
        subject_name: row.subject_name, // Now using subject_name instead of description
        test_type: row.test_type,
        test_date: row.test_date,
        grade: row.grade,
        class_name_snapshot: row.class_name_snapshot, // include the snapshot
      });
    }
    return acc;
  }, []);

  return apprentices;
};

export const getSubjectsByUser = async (id_person) => {
  const result = await query(
    `SELECT asub.id, asub.subject_name 
     FROM apprentice_subjects_z asz
     JOIN apprentice_subjects asub ON asz.id_subject = asub.id
     WHERE asz.id_person = $1`,
    [id_person]
  );
  return result.rows;
};
