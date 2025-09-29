// components/Modal/ReportReviewModal.jsx
import React from "react";
import { format, addDays, startOfISOWeek, startOfYear } from "date-fns";
import { de } from "date-fns/locale"; // Deutsche Lokalisierung

const dayOfWeekMap = {
  1: "Montag",
  2: "Dienstag",
  3: "Mittwoch",
  4: "Donnerstag",
  5: "Freitag",
};

// Funktion zur Berechnung des Wochenanfangs (Montag) und -endes (Freitag)
const getWeekRange = (year, week) => {
  const firstDayOfYear = startOfYear(new Date(year, 0, 1));
  const firstWeekStart = startOfISOWeek(firstDayOfYear);
  const monday = addDays(firstWeekStart, (week - 1) * 7); // Montag
  const friday = addDays(monday, 4); // Freitag

  return {
    startDate: format(monday, "dd.MM.yyyy", { locale: de }),
    endDate: format(friday, "dd.MM.yyyy", { locale: de }),
  };
};

const ReportReviewModal = ({ report, onClose }) => {
  if (!report) return null;

  // Start- und Enddatum berechnen (Montag - Freitag)
  const { startDate, endDate } = getWeekRange(report.year, report.calendar_week);

  // Use the snapshot value if available; otherwise fallback to the current class_name
  const className = report.class_name_snapshot || report.class_name;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-900 text-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Bericht von {report.firstname} {report.lastname}
        </h2>

        <p>
          <strong>Kalenderwoche:</strong> {report.calendar_week}
        </p>
        <p>
          <strong>Datum:</strong> {startDate} - {endDate}
        </p>
        {className && (
          <p>
            <strong>Klasse:</strong> {className}
          </p>
        )}

        {/* Scrollbare Inhaltsbox */}
        <div className="mt-4 p-2 border border-gray-700 rounded bg-gray-800 max-h-40 overflow-y-auto">
          <strong>Inhalt:</strong>
          <p className="whitespace-pre-line">{report.content}</p>
        </div>

        {
          report.school_content && (
            <div className="mt-4 p-2 border border-gray-700 rounded bg-gray-800 max-h-40 overflow-y-auto">
              <strong>Schulinhalte:</strong>
              <ul>
                {Object.entries(report.school_content).map(([subject, content]) => (
                  <li key={subject}>
                    <strong>{subject}:</strong> {content}
                  </li>
                ))}
              </ul>
            </div>
          )

        }

        <h3 className="text-lg font-semibold mt-4">Tage & Typen:</h3>
        <ul className="list-disc pl-5">
          {report.days && report.days.length > 0 ? (
            report.days.map((day, index) => (
              <li key={index}>
                <strong>{dayOfWeekMap[day.day_of_week] || "Unbekannter Tag"}:</strong> {day.type}
              </li>
            ))
          ) : (
            <p>Keine Tage verfügbar.</p>
          )}
        </ul>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="btn bg-red-600 hover:bg-red-500 text-white"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportReviewModal;
