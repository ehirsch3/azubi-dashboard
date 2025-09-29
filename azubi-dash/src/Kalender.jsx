import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "./components/Modal/Modal";
import "./components/Kalender.css";

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/calendar/2280`,
          {
            withCredentials: true,
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to get days of the month
  const getDaysInMonth = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const days = [];
    let day = startOfMonth;

    while (day.isBefore(endOfMonth, "day")) {
      days.push(day.clone());
      day.add(1, "day");
    }

    return days;
  };

  // Helper function to get event count for a specific day
  const getEventCountForDay = (day) => {
    return events.filter((event) => moment(event.event_date).isSame(day, "day"))
      .length;
  };

  // Handle day click: Open modal and set events for that day
  const handleDayClick = (day) => {
    const dayEvents = events.filter((event) =>
      moment(event.event_date).isSame(day, "day")
    );
    setSelectedDayEvents(dayEvents);
    setIsModalOpen(true);
  };

  // Render calendar days with event indicators
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth();

    return daysInMonth.map((day, index) => {
      const eventCount = getEventCountForDay(day);
      return (
        <div
          key={index}
          className={`calendar-day ${eventCount > 0 ? "has-event" : ""}`}
          onClick={() => handleDayClick(day)} // Click handler for opening the modal
        >
          {day.date()}
          {eventCount > 0 && (
            <div className="event-indicator">{eventCount}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          onClick={() =>
            setCurrentDate(currentDate.clone().subtract(1, "month"))
          }
        >
          Prev
        </button>
        <span>{currentDate.format("MMMM YYYY")}</span>
        <button
          onClick={() => setCurrentDate(currentDate.clone().add(1, "month"))}
        >
          Next
        </button>
      </div>
      <div className="calendar-body">
        <div className="calendar-day-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-days">{renderCalendarDays()}</div>
      </div>

      {/* Modal to display events */}
      <Modal
        isOpen={isModalOpen}
        events={selectedDayEvents}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Kalender;
