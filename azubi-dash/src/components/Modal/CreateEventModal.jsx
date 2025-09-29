import React, { useState } from "react";
import moment from "moment";
import axios from "axios";  // Import axios
import './Modal.css';

moment.locale('de');

const CreateEventModal = ({ isOpen, onClose, onEventAdded }) => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("Meeting");
  const [eventDate, setEventDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventTime, setEventTime] = useState(moment().format("HH:mm"));
  const [reminderTime, setReminderTime] = useState(moment().add(30, 'minutes').format("YYYY-MM-DDTHH:mm"));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("");
  const [isReminderChecked, setIsReminderChecked] = useState(false);

  const base64UrlDecode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded);
  };

  const getIdFromCookie = () => {
    try {
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      if (!tokenCookie) {
        throw new Error("Token cookie not found.");
      }

      const token = tokenCookie.split('=')[1];
      if (!token) {
        throw new Error("Token is empty.");
      }

      // Split the token into header, payload, and signature
      const [header, payload, signature] = token.split('.');

      if (!payload) {
        throw new Error("Payload is missing in the token.");
      }

      // Decode the payload
      const decodedPayload = base64UrlDecode(payload);

      // Get the id from the decoded payload
      if (!decodedPayload.id) {
        throw new Error("id not found in the token payload.");
      }

      return decodedPayload.id; // Return the user id
    } catch (error) {
      console.error("Failed to retrieve id from cookie:", error);
      return null;
    }
  };

  const userId = getIdFromCookie();  // Retrieve the id (from users table)
  console.log("User ID from cookie:", userId);

  // Create axios instance with credentials
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3002/api/',
    withCredentials: true, // Ensure cookies are included in the request
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // Ensure the user ID is retrieved
    const id = getIdFromCookie();
    if (!id) {
      console.error("Failed to retrieve id from cookie.");
      return;
    }

    // Construct the event payload
    const newEvent = {
      id_person: id,
      event_title: eventTitle,
      event_description: eventDescription,
      event_type: eventType,
      event_date: moment(`${eventDate}T${eventTime}`).format("YYYY-MM-DDTHH:mm:ss"),
      reminder_time: isReminderChecked
        ? moment(reminderTime).format("YYYY-MM-DDTHH:mm:ss")
        : null,
      is_recurring: isRecurring,
      recurrence_rule: recurrenceRule,
      recurrence_end_date: isRecurring
        ? moment().add(1, "month").format("YYYY-MM-DDTHH:mm:ss")
        : null,
    };

    try {
      // Send POST request to /api/calendar/{id}
      const response = await axiosInstance.post(`calendar/${id}`, newEvent, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Event added successfully!");
        onEventAdded(newEvent); // Call parent callback to update state
        onClose(); // Close modal
      } else {
        throw new Error(`Failed to add event: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding event:", error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Neuen Termin hinzufügen</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Event-Titel</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Beschreibung</label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Event-Typ</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="Meeting">Meeting</option>
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference</option>
              <option value="Webinar">Webinar</option>
            </select>
          </div>
          <div>
            <label>Datum</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Uhrzeit</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Wiederholung</label>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            {isRecurring && (
              <div>
                <label>Wiederholungsregel</label>
                <input
                  type="text"
                  placeholder="z.B. jeden Montag"
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <label>
              Erinnerungszeit setzen
              <input
                type="checkbox"
                checked={isReminderChecked}
                onChange={(e) => setIsReminderChecked(e.target.checked)}
              />
            </label>
          </div>

          {isReminderChecked && (
            <div>
              <label>Erinnerungszeit</label>
              <input
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit">Speichern</button>
        </form>
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default CreateEventModal;
