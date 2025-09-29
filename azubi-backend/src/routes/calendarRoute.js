// routes/calendarRoute.js

import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js"; // Optional, for authentication
import * as calendarController from "../controllers/calendarController.js";

const router = express.Router();

// Create a new event
router.post(
  "/calendar/:id_person",
  authenticateJWT,
  calendarController.createEvent
);

// Get all events for a specific person (id_person)
router.get(
  "/calendar/:id_person",
  authenticateJWT,
  calendarController.getEvents
);

// Get a single event by ID
router.get(
  "/calendar/event/:eventId",
  authenticateJWT,
  calendarController.getEventById
);

// Update an event by ID
router.put(
  "/calendar/event/:eventId",
  authenticateJWT,
  calendarController.updateEvent
);

// Delete an event by ID
router.delete(
  "/calendar/event/:eventId",
  authenticateJWT,
  calendarController.deleteEvent
);

export default router;
