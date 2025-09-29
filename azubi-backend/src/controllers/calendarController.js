// controllers/calendarController.js

import * as calendarService from "../services/calendarService.js";

// Create a new calendar event
export const createEvent = async (req, res) => {
  const eventData = req.body;

  try {
    const createdEvent = await calendarService.createCalendarEvent(eventData);
    return res.status(201).json(createdEvent); // Return the newly created event
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Failed to create event." });
  }
};

// Get all events for a specific apprentice (id_person)
export const getEvents = async (req, res) => {
  const { id_person } = req.params;

  try {
    const events = await calendarService.getCalendarEvents(id_person);
    return res.status(200).json(events); // Return list of events
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Failed to fetch events." });
  }
};

// Get a specific event by its ID
export const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await calendarService.getCalendarEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.status(200).json(event); // Return the event details
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Failed to fetch event." });
  }
};

// Update an existing calendar event
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const eventData = req.body;

  try {
    const updatedEvent = await calendarService.updateCalendarEvent(
      eventId,
      eventData
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.status(200).json(updatedEvent); // Return the updated event
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Failed to update event." });
  }
};

// Delete a calendar event
export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const isDeleted = await calendarService.deleteCalendarEvent(eventId);
    if (!isDeleted) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Failed to delete event." });
  }
};
