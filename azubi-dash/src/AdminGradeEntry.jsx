import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminGradeEntry.css";

const AdminGradeEntry = () => {
  const [apprentices, setApprentices] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    column: "test_type",
    direction: "asc",
  }); // Sorting configuration for expanded row

  useEffect(() => {
    // Fetch all apprentices and their grades for the admin
    axios
      .get("http://localhost:3002/api/grades/all", { withCredentials: true })
      .then((response) => {
        setApprentices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching apprentices' grades:", error);
      });
  }, []);

  const toggleRow = (id_person) => {
    // Toggle the expanded row for a specific apprentice
    setExpandedRow(expandedRow === id_person ? null : id_person);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("de-DE", options).format(date); // German locale
  };

  const calculateSubjectWeightedAverage = (subjectGrades) => {
    const weights = {
      Schulaufgabe: 2,
      Stegreifaufgabe: 1,
      Kurzarbeit: 1.5,
    };

    let totalWeight = 0;
    let weightedSum = 0;

    subjectGrades.forEach((grade) => {
      const weight = weights[grade.test_type] || 1;
      weightedSum += grade.grade * weight;
      totalWeight += weight;
    });

    const average = totalWeight > 0 ? weightedSum / totalWeight : 0;
    return average > 0 ? Math.round(average * 100) / 100 : "N/A"; // Round the average to 2 decimals
  };

  // Group grades by subject_name for each apprentice
  const groupGradesBySubject = (grades) => {
    return grades.reduce((acc, grade) => {
      const subject = grade.subject_name; // Now grouping by subject_name
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(grade);
      return acc;
    }, {});
  };

  // Sorting handler for expanded row
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ column, direction });
  };

  // Function to sort the grades for the expanded row
  const sortedGrades = (grades) => {
    const { column, direction } = sortConfig;

    return grades.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Handle sorting for date fields (Datum)
      if (column === "test_date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="admin-grade-entry">
      <h2 className="title">Noteneinsicht der Auszubildenden</h2>
      <table className="grades-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Noten</th>
            <th>Durchschnitt pro Fach</th>
            <th>Klasse</th> {/* New header column for class snapshot */}
          </tr>
        </thead>
        <tbody>
          {apprentices.map((apprentice) => (
            <React.Fragment key={apprentice.id_person}>
              <tr
                className="apprentice-row"
                onClick={() => toggleRow(apprentice.id_person)}
              >
                <td className="apprentice-name">{apprentice.name}</td>
                <td className="grades-toggle">
                  {apprentice.grades.length > 0
                    ? `Noten anzeigen (${apprentice.grades.length})`
                    : "Keine Noten vorhanden"}
                </td>
                <td className="average-grade">
                  {apprentice.grades.length > 0
                    ? Object.entries(
                        groupGradesBySubject(apprentice.grades)
                      ).map(([subject, grades]) => (
                        <div key={subject}>
                          <strong>{subject}:</strong>{" "}
                          {calculateSubjectWeightedAverage(grades)}
                        </div>
                      ))
                    : "N/A"}
                </td>
                <td className="class-snapshot">
                  {/* Assuming the snapshot is stored on each grade, you can display the class from the first grade if available */}
                  {apprentice.grades.length > 0 &&
                  apprentice.grades[0].class_name_snapshot
                    ? apprentice.grades[0].class_name_snapshot
                    : "Keine Klasse"}
                </td>
              </tr>
              {expandedRow === apprentice.id_person && (
                <tr>
                  <td colSpan="4" className="grades-detail">
                    <table className="grades-detail-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("test_type")}>
                            Testart
                          </th>
                          <th onClick={() => handleSort("test_date")}>Datum</th>
                          <th onClick={() => handleSort("grade")}>Note</th>
                          <th onClick={() => handleSort("subject_name")}>
                            Fach
                          </th>{" "}
                          {/* Updated column for subject_name */}
                          <th>Klasse</th>{" "}
                          {/* Column for snapshot class per grade */}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedGrades(apprentice.grades).map((grade) => (
                          <tr key={grade.id}>
                            <td>{grade.test_type}</td>
                            <td>{formatDate(grade.test_date)}</td>
                            <td>
                              <span className={`grade grade-${grade.grade}`}>
                                {grade.grade}
                              </span>
                            </td>
                            <td>{grade.subject_name}</td>{" "}
                            {/* Updated for subject_name */}
                            <td>
                              {grade.class_name_snapshot || "Keine Klasse"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGradeEntry;
