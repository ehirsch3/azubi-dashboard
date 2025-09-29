// Modal.jsx
import React, { useState } from "react";
import moment from "moment";
import './Modal.css';
import CreateEventModal from './CreateEventModal';

moment.locale('de');

const Modal = ({ isOpen, events, onClose }) => {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  // Das Datum in ein Format mit Monatszahl umwandeln
  const formattedDate = events[0]?.event_date 
    ? moment(events[0].event_date).format("D.MM.YYYY")  // Monat als Zahl anzeigen
    : "";

  const handleCreateEvent = (newEvent) => {
    // Hier kannst du den Event an den Server oder State weiterleiten
    console.log("Neues Event erstellt:", newEvent);
  };

  const openCreateEventModal = () => {
    setIsCreateEventModalOpen(true);
  };

  const closeCreateEventModal = () => {
    setIsCreateEventModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Termine am {formattedDate}</h2>
        {events.length === 0 ? (
          <p>Für diesen Tag gibt es keine Termine.</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.event_title}</strong>
                <p>{event.event_description}</p>
              </li>
            ))}
          </ul>
        )}
        <button onClick={openCreateEventModal}>Neuen Termin hinzufügen</button>
        <button onClick={onClose}>Schließen</button>
      </div>

      {/* CreateEventModal anzeigen, wenn der Button geklickt wird */}
      <CreateEventModal 
        isOpen={isCreateEventModalOpen} 
        onClose={closeCreateEventModal}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Modal;
