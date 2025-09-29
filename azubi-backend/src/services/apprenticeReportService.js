import { query } from "../db.js";

// Alle Berichte abrufen mit den Namen der Azubis
export const getAllReports = async () => {
  const sql = `
      SELECT 
  ar.*, 
  p.firstname, 
  p.lastname, 
  COALESCE(ar.class_name_snapshot, ac.class_name) AS class_name
FROM apprentice_report ar
JOIN person p ON p.id = ar.id_person
LEFT JOIN apprentice_classes_z acz ON acz.id_person = ar.id_person
LEFT JOIN apprentice_classes ac ON acz.id_class = ac.id
    `;
  const result = await query(sql);
  return result.rows;
};

export const getReportById = async (id) => {
  const sql = `
    SELECT 
      ar.*, 
      p.firstname, 
      p.lastname, 
      ac.class_name
    FROM apprentice_report ar
    JOIN person p ON p.id = ar.id_person
    LEFT JOIN apprentice_classes_z acz ON acz.id_person = ar.id_person
    LEFT JOIN apprentice_classes ac ON ac.id = acz.id_class
    WHERE ar.id = $1;
  `;
  const result = await query(sql, [id]);
  let report = result.rows[0];
  report.school_content = JSON.parse(report.school_content);
  return report;
};

// Alle Tage für einen bestimmten Bericht abrufen
export const getReportDaysByReportId = async (report_id) => {
  const sql = `SELECT * FROM apprentice_report_day WHERE report_id = $1`;
  const result = await query(sql, [report_id]);
  return result.rows;
};

// Service zur Erstellung eines Reports mit benutzerdefinierten Tagen
export const createReport = async (
  id_person,
  calendar_week,
  year,
  content,
  class_id_snapshot,
  class_name_snapshot,
  school_content
) => {
  console.log(school_content);
  let school_content_string = JSON.stringify(school_content);

  try {
    const sql = `
      INSERT INTO apprentice_report 
        (id_person, calendar_week, year, content, status, class_id_snapshot, class_name_snapshot, school_content)
      VALUES 
        ($1, $2, $3, $4, 'draft', $5, $6, $7)
      RETURNING id;
    `;
    const result = await query(sql, [
      id_person,
      calendar_week,
      year,
      content,
      class_id_snapshot,
      class_name_snapshot,
      school_content_string,
    ]);
    const report_id = result.rows[0].id;
    return { report_id };
  } catch (err) {
    console.error("❌ Fehler beim Erstellen des Reports:", err);
    throw err;
  }
};

// Service zum Erstellen von Tagen für den Report
export const createReportDay = async (report_id, day_of_week, type) => {
  const sql = `
    INSERT INTO apprentice_report_day (report_id, day_of_week, type)
    VALUES ($1, $2, $3);`;
  await query(sql, [report_id, day_of_week, type]);
};

// Löscht alle Tage zu einem bestimmten Bericht
export const deleteReportDaysByReportId = async (report_id) => {
  const sql = "DELETE FROM apprentice_report_day WHERE report_id = $1";
  await query(sql, [report_id]);
};

export const updateReport = async (report) => {
  let school_content_string = JSON.stringify(report.school_content);

  try {
    const sql = `
      UPDATE apprentice_report 
        SET calendar_week = $1, year = $2, content = $3, class_id_snapshot = $4, class_name_snapshot = $5, school_content = $6
        WHERE id = $7
      RETURNING *
    `;
    const result = await query(sql, [
      report.calendar_week,
      report.year,
      report.content,
      report.class_id_snapshot,
      report.class_name_snapshot,
      school_content_string,
      report.id,
    ]);
    const report_id = result.rows[0].id;
    return { report_id };
  } catch (err) {
    console.error("❌ Fehler beim Erstellen des Reports:", err);
    throw err;
  }
};

// 🔹 Bericht zur Genehmigung einreichen
export const submitReport = async (id) => {
  const sql = `UPDATE apprentice_report SET status = 'submitted', submitted_at = NOW() WHERE id = $1 RETURNING *`;
  const result = await query(sql, [id]);
  return result.rows[0];
};

// Bericht genehmigen
export const approveReport = async (id, approved_by) => {
  const sql = `UPDATE apprentice_report SET status = 'approved', approved_at = NOW(), approved_by = $2, deny_message = $3 WHERE id = $1 RETURNING *`;
  const result = await query(sql, [id, approved_by, ""]);
  return result.rows[0];
};

// Bericht ablehnen (Status zurück auf "draft" setzen)
export const declineReport = async (id, deny_message) => {
  const sql = `
    UPDATE apprentice_report 
    SET status = 'draft',
    deny_message = $2
    WHERE id = $1 
    RETURNING *;
  `;
  const result = await query(sql, [id, deny_message]);
  return result.rows[0];
};

// Einen Bericht löschen
export const deleteReport = async (id) => {
  const sql = "DELETE FROM apprentice_report WHERE id = $1 RETURNING *";
  const result = await query(sql, [id]);
  return result.rows[0];
};

// Holen der bereits verwendeten Kalenderwochen
export const getUsedCalendarWeeks = async (year) => {
  const sql = `SELECT calendar_week FROM apprentice_report WHERE year = $1`;
  const result = await query(sql, [year]);
  return result.rows.map((row) => row.calendar_week); // Gibt nur die Kalenderwochen zurück
};

export const getSubjectsForReport = async (id_person) => {
  const sql = `
    SELECT 
      asz.id_subject,
      asub.subject_name
    FROM apprentice_subjects_z asz 
    INNER JOIN apprentice_subjects asub ON asz.id_subject = asub.id
    WHERE asz.id_person = $1;
  `;
  const result = await query(sql, [id_person]);
  return result.rows;
};
