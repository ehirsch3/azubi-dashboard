// components/Modal/ReportPrintModal.jsx
import React from "react";

// Helper function to calculate the Monday date for a given ISO calendar week and year.
function getMondayOfWeek(year, week) {
  // January 4th is always in week 1 according to ISO standards.
  const simple = new Date(year, 0, 4);
  const dayOfWeek = simple.getDay() || 7; // treat Sunday as 7 instead of 0
  // Calculate the first Monday of the year:
  const firstMonday = new Date(simple);
  firstMonday.setDate(simple.getDate() - dayOfWeek + 1);

  // Now, add (week - 1) weeks to the first Monday.
  const monday = new Date(firstMonday);
  monday.setDate(firstMonday.getDate() + (week - 1) * 7);
  return monday;
}

// Helper function to calculate the Friday date for a given ISO calendar week and year.
function getFridayOfWeek(year, week) {
  const monday = getMondayOfWeek(year, week);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4); // Friday is 4 days after Monday
  return friday;
}

// Format a date as DD.MM.YYYY
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function ReportPrintModal({ report, onClose }) {
  // Calculate the Friday date of the report's calendar week.
  const fridayDate =
    report.year && report.calendar_week
      ? formatDate(getFridayOfWeek(report.year, report.calendar_week))
      : "";

  // Define German day names.
  const dayNames = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

  // Build apprentice's full name using top-level properties or nested ones.
  const apprenticeName =
    (report.firstname && report.lastname)
      ? `${report.firstname} ${report.lastname}`
      : (report.person && report.person.firstname && report.person.lastname)
        ? `${report.person.firstname} ${report.person.lastname}`
        : "";

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 p-6 rounded shadow-lg max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          {apprenticeName
            ? `Berichtsheft von ${apprenticeName} KW${report.calendar_week} ${report.year}`
            : `Berichtsheft KW ${report.calendar_week}`}
        </h2>

        {/* Report Header */}
        <div className="mb-4">
          <p>
            <strong>Kalenderwoche:</strong> {report.calendar_week}
          </p>
          <p>
            <strong>Datum:</strong>{" "}
            {fridayDate ? fridayDate : "Datum nicht verfügbar"}
          </p>
          <p>
            <strong>Jahr:</strong> {report.year}
          </p>
          {apprenticeName && (
            <p>
              <strong>Auszubildender:</strong> {apprenticeName}
            </p>
          )}
          {report.class_name && (
            <p>
              <strong>Klasse:</strong> {report.class_name}
            </p>
          )}
        </div>

        {/* Report Content */}
        <div className="mb-4">
          <p>
            <strong>Inhalt:</strong>
          </p>
          <p>{report.content}</p>
        </div>

        {
          report.school_content && (
            <div className="mb-4">
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

        {/* Report Days */}
        {report.days && report.days.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold">Tage</h3>
            <ul className="list-disc ml-5">
              {report.days.map((day, index) => {
                // Assume day.day_of_week is a number 1 (Montag) through 5 (Freitag)
                const dayName =
                  dayNames[day.day_of_week - 1] || `Tag ${day.day_of_week}`;
                return (
                  <li key={index}>
                    {dayName}: {day.type}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Signature lines with extra upward space above the line */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="h-12"></div>
            <div className="border-t pt-2">
              <p>Auszubildender</p>
            </div>
          </div>
          <div className="text-center">
            <div className="h-12"></div>
            <div className="border-t pt-2">
              <p>Ausbilder</p>
            </div>
          </div>
        </div>

        <div className="text-right text-sm mt-4">
  <strong>Gesamtstunden: 38</strong>
</div>


        {/* Modal Actions: hidden when printing */}
        <div className="flex justify-end space-x-2 mt-6 print:hidden">
          <button onClick={() => window.print()} className="btn btn-primary">
            Drucken
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
