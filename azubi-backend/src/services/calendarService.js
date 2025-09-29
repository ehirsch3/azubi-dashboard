// services/calendarService.js

import { query } from "../db.js";

// Create a new calendar event
export const createCalendarEvent = async (eventData) => {
  const {
    id_person,
    event_title,
    event_description,
    event_type,
    event_date,
    reminder_time,
    is_recurring,
    recurrence_rule,
    recurrence_end_date,
    event_status,
  } = eventData;

  const sql = `
    INSERT INTO apprentice_calendar 
    (id_person, event_title, event_description, event_type, event_date, reminder_time, is_recurring, recurrence_rule, recurrence_end_date, event_status) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    id_person,
    event_title,
    event_description,
    event_type,
    event_date,
    reminder_time,
    is_recurring,
    recurrence_rule,
    recurrence_end_date,
    event_status,
  ];

  try {
    const result = await query(sql, values);
    return result.rows[0]; // Return the created event
  } catch (error) {
    throw new Error("Error creating calendar event: " + error.message);
  }
};

// Get all calendar events for a person
export const getCalendarEvents = async (id_person) => {
  const sql = `
    SELECT * FROM apprentice_calendar
    WHERE id_person = $1
    ORDER BY event_date ASC;
  `;

  try {
    const result = await query(sql, [id_person]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching calendar events: " + error.message);
  }
};

// Get a single calendar event by ID
export const getCalendarEventById = async (eventId) => {
  const sql = `
    SELECT * FROM apprentice_calendar
    WHERE id = $1;
  `;

  try {
    const result = await query(sql, [eventId]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error fetching calendar event: " + error.message);
  }
};

// Update a calendar event
export const updateCalendarEvent = async (eventId, eventData) => {
  const {
    event_title,
    event_description,
    event_type,
    event_date,
    reminder_time,
    is_recurring,
    recurrence_rule,
    recurrence_end_date,
    event_status,
  } = eventData;

  const sql = `
    UPDATE apprentice_calendar 
    SET 
      event_title = $1, 
      event_description = $2, 
      event_type = $3, 
      event_date = $4, 
      reminder_time = $5, 
      is_recurring = $6, 
      recurrence_rule = $7, 
      recurrence_end_date = $8, 
      event_status = $9,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $10
    RETURNING *;
  `;

  const values = [
    event_title,
    event_description,
    event_type,
    event_date,
    reminder_time,
    is_recurring,
    recurrence_rule,
    recurrence_end_date,
    event_status,
    eventId,
  ];

  try {
    const result = await query(sql, values);
    return result.rows[0]; // Return the updated event
  } catch (error) {
    throw new Error("Error updating calendar event: " + error.message);
  }
};

// Delete a calendar event
export const deleteCalendarEvent = async (eventId) => {
  const sql = `DELETE FROM apprentice_calendar WHERE id = $1 RETURNING id;`;

  try {
    const result = await query(sql, [eventId]);
    return result.rowCount > 0; // Return true if deletion is successful
  } catch (error) {
    throw new Error("Error deleting calendar event: " + error.message);
  }
};
