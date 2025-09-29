import axios from "axios";
import {
  FaEdit,
  FaPaperPlane,
  FaEye,
  FaPrint,
  FaTrash,
  FaCommentDots,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import ReportReviewModal from "./components/Modal/ReportReviewModal";
import ReportPrintModal from "./components/Modal/ReportPrintModal";
import ReportEditModal from "./components/Modal/ReportEditModal";
import ConfirmDeleteModal from "./components/Modal/ConfirmDeleteModal";
import Checkbox from "./components/Checkbox";
import ModalMain from "./components/Modal/ModalMain";

// Mapping des Status ins Deutsche
const statusMapping = {
  draft: "Entwurf",
  submitted: "Eingereicht",
  approved: "Genehmigt",
};

// Mapping für die farbliche Darstellung der Status
const statusColorMapping = {
  draft: "text-orange-500",
  submitted: "text-yellow-500",
  approved: "text-green-500",
};

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    calendar_week: "",
    year: new Date().getFullYear(),
    content: "",
    days: [
      { day_of_week: 1, type: "Arbeitstag" },
      { day_of_week: 2, type: "Arbeitstag" },
      { day_of_week: 3, type: "Arbeitstag" },
      { day_of_week: 4, type: "Arbeitstag" },
      { day_of_week: 5, type: "Arbeitstag" },
    ],
    school_content: "",
  });
  const [usedWeeks, setUsedWeeks] = useState([]); // Already used calendar weeks
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // For review modal
  const [selectedPrintReport, setSelectedPrintReport] = useState(null); // For print view modal
  const [selectedEditReport, setSelectedEditReport] = useState(null); // For editing modal
  const [reportToDelete, setReportToDelete] = useState(null); // For deletion confirmation modal
  const [formHeight, setFormHeight] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: "asc",
  });
  const navigate = useNavigate();
  const [useLastTemplate, setUseLastTemplate] = useState(false);
  const [showSubjects, setShowSubjects] = useState([]);
  const [showS, setShowS] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [reportDenyMessageModal, setReportDenyMessageModal] = useState(null);

  const dayNames = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

  // Ref für den Formular-Container
  const formContainerRef = useRef(null);

  // Axios instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api/",
    withCredentials: true,
  });

  useEffect(() => {
    console.log("New Report obj", newReport);
  }, [newReport]);

  useEffect(() => {
    fetchReports();
    fetchUsedWeeks(newReport.year); // Fetch used calendar weeks for the current year
  }, [newReport.year]);

  // Nach dem Rendern messen wir die Höhe des Formulars
  useEffect(() => {
    if (formContainerRef.current) {
      setFormHeight(formContainerRef.current.clientHeight);
    }
  }, [newReport, reports]);

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get("reports");
      setReports(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch used calendar weeks for the current year
  const fetchUsedWeeks = async (year) => {
    try {
      const response = await axiosInstance.get(`reports/used-weeks/${year}`);
      setUsedWeeks(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate available weeks (1-53) excluding used ones
  const getAvailableWeeks = () => {
    const allWeeks = Array.from({ length: 53 }, (_, index) => index + 1);
    return allWeeks.filter((week) => !usedWeeks.includes(week));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => {
      const updatedReport = { ...prev, [name]: value };

      // If the year changes, load the last saved content for that year
      if (name === "year") {
        const savedContent = localStorage.getItem(`last_report_${value}`);
        if (savedContent) {
          updatedReport.content = savedContent;
        }
      }

      return updatedReport;
    });
  };

  const handleSchoolSet = (e, subject) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({
      ...prev,
      school_content: { ...prev.school_content, [subject.subject_name]: value },
    }));
  };

  useEffect(() => {
    let isSchule = showSubjects.find((obj) => obj.value === "Berufsschultag");
    if (isSchule && !showS) {
      setShowS(true);
      handleFetchSubjects();
    } else if (!isSchule && showS) {
      setShowS(false);
      console.log("Keine Schule");
    }
  }, [showSubjects]);

  const handleFetchSubjects = async () => {
    try {
      const response = await axiosInstance.get("subject-report");
      setSubjects(response.data);
      // console.log(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDayChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDays = [...newReport.days];
    updatedDays[index] = { ...updatedDays[index], [name]: value };
    setNewReport((prev) => ({ ...prev, days: updatedDays }));

    setShowSubjects((prevShowSubjects) => {
      if (prevShowSubjects.map((obj) => obj.index).includes(index)) {
        return prevShowSubjects.map((obj) =>
          obj.index === index ? { index, value } : obj
        );
      }
      return [...prevShowSubjects, { index: index, value: value }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("reports", newReport);

      // Save final submitted content
      localStorage.setItem(`last_report_${newReport.year}`, newReport.content);

      // Save draft (useful if user wants to load before submitting)
      localStorage.setItem(`last_draft_${newReport.year}`, newReport.content);

      setNewReport({
        calendar_week: "",
        year: new Date().getFullYear(),
        content: "",
        days: [
          { day_of_week: 1, type: "" },
          { day_of_week: 2, type: "" },
          { day_of_week: 3, type: "" },
          { day_of_week: 4, type: "" },
          { day_of_week: 5, type: "" },
        ],
        school_content: "",
      });

      setSubjects([]);

      fetchUsedWeeks(newReport.year);
      fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckboxChange = (e) => {
    setUseLastTemplate(e.target.checked);
    if (e.target.checked) {
      // Apply last saved report content when checked
      const lastReport = reports[reports.length - 1]; // Get the last report, or handle logic as needed
      setNewReport((prev) => ({
        ...prev,
        content: lastReport.content,
      }));
    } else {
      // Clear content when unchecked
      setNewReport((prev) => ({
        ...prev,
        content: "",
      }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`reports/${id}`);
      fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitReport = async (id) => {
    try {
      await axiosInstance.put(`reports/${id}/submit`);
      fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewReport = async (id) => {
    try {
      const response = await axiosInstance.get(`reports/${id}`);
      setSelectedReport(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrintView = async (id) => {
    try {
      const response = await axiosInstance.get(`reports/${id}`);
      setSelectedPrintReport(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditReport = async (id) => {
    try {
      const response = await axiosInstance.get(`reports/${id}`);
      setSelectedEditReport(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateReport = async (updatedReport) => {
    try {
      await axiosInstance.put(`reports/${updatedReport.id}`, updatedReport);
      fetchReports();
      setSelectedEditReport(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDenyMessage = (report) => {
    setReportDenyMessageModal(report);
  };

  const handleCloseDenyMessage = () => {
    setReportDenyMessageModal(null);
  };

  const handleCloseReviewModal = () => {
    setSelectedReport(null);
  };

  const handleClosePrintModal = () => {
    setSelectedPrintReport(null);
  };

  const handleCloseEditModal = () => {
    setSelectedEditReport(null);
  };

  const handleDeleteClick = (id) => {
    setReportToDelete(id);
  };

  const confirmDeletion = () => {
    if (reportToDelete) {
      handleDelete(reportToDelete);
      setReportToDelete(null);
    }
  };

  const cancelDeletion = () => {
    setReportToDelete(null);
  };

  // Sortierfunktion
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ column, direction });
  };

  const sortedReports = () => {
    if (!sortConfig.column) return reports;
    return [...reports].sort((a, b) => {
      let aVal = a[sortConfig.column];
      let bVal = b[sortConfig.column];
      if (sortConfig.column === "status") {
        aVal = aVal || "";
        bVal = bVal || "";
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Berichtserstellung und Verwaltung
      </h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Flex-Container, der beide Bereiche nebeneinander anordnet */}
      <div className="flex flex-col md:flex-row gap-6">
        <div ref={formContainerRef} className="w-full md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-gray p-4 rounded-md shadow-sm border"
          >
            <h2 className="text-xl font-semibold text-center mb-4">
              Neuen Bericht erstellen
            </h2>

            <div className="flex gap-3 mb-3">
              {/* Kalenderwoche */}
              <div className="flex-1">
                <label
                  htmlFor="calendar_week"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Kalenderwoche
                </label>
                <select
                  id="calendar_week"
                  name="calendar_week"
                  value={newReport.calendar_week}
                  onChange={handleInputChange}
                  className="input input-bordered w-full text-sm"
                  required
                >
                  <option value="">KW wählen</option>
                  {getAvailableWeeks().map((week) => (
                    <option key={week} value={week}>
                      KW {week}
                    </option>
                  ))}
                </select>
              </div>
              {/* Jahr */}
              <div className="flex-1">
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Jahr
                </label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  placeholder="Jahr"
                  value={newReport.year}
                  onChange={handleInputChange}
                  className="input input-bordered w-full text-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Berichtsinhalte
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="Inhalte eingeben..."
                value={newReport.content}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full text-sm h-24"
                required
              ></textarea>
            </div>

            {subjects.length > 0 &&
              showS &&
              subjects.map((subject, index) => (
                <div key={index} className="mb-3">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    {subject.subject_name}
                  </label>
                  <textarea
                    id="school_content"
                    name="school_content"
                    placeholder="Inhalte eingeben..."
                    value={newReport.school_content[subject.subject_name]}
                    onChange={(e) => handleSchoolSet(e, subject)}
                    className="textarea textarea-bordered w-full text-sm h-24"
                    required
                  ></textarea>
                </div>
              ))}

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Tage & Typen
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {newReport.days.map((day, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-600">
                      {dayNames[index]}
                    </span>
                    <select
                      name="type"
                      value={day.type}
                      onChange={(e) => handleDayChange(e, index)}
                      className="input input-bordered text-xs"
                      required
                    >
                      <option value="Arbeitstag">Arbeit</option>
                      <option value="Krank">Krank</option>
                      <option value="Urlaub">Urlaub</option>
                      <option value="Berufsschultag">Schule</option>
                      <option value="Feiertag">Feiertag</option>
                    </select>
                  </div>
                ))}
                <div className="mb-4 flex items-center">
                  <Checkbox
                    checked={useLastTemplate}
                    onChange={handleCheckboxChange}
                    label="Letzte Vorlage anwenden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-sm py-2"
            >
              Bericht erstellen
            </button>
          </form>
        </div>

        {/* Right section (Berichtsheft table) remains narrower (1/2) */}
        <div
          className="w-full md:w-1/2 overflow-y-auto"
          style={{ height: formHeight || "auto" }}
        >
          <h2 className="text-2xl font-semibold mb-4">Berichtsheft</h2>
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("calendar_week")}
                    className="cursor-pointer text-center"
                  >
                    KW{" "}
                    {sortConfig.column === "calendar_week"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("year")}
                    className="cursor-pointer text-center"
                  >
                    Jahr{" "}
                    {sortConfig.column === "year"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="cursor-pointer text-center"
                  >
                    Status{" "}
                    {sortConfig.column === "status"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("class_name")}
                    className="cursor-pointer text-center"
                  >
                    Klasse{" "}
                    {sortConfig.column === "class_name"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="text-center">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {sortedReports().map((report) => (
                  <tr key={report.id}>
                    <td className="text-center">{report.calendar_week}</td>
                    <td className="text-center">{report.year}</td>
                    <td
                      className={`text-center ${
                        statusColorMapping[report.status] || ""
                      }`}
                    >
                      {statusMapping[report.status] || report.status}
                    </td>
                    <td className="text-center">{report.class_name || "-"}</td>
                    <td className="text-center">
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {report.status === "draft" && (
                            <button
                              onClick={() => handleEditReport(report.id)}
                              className="btn bg-yellow-500 text-black hover:bg-yellow-600 btn-sm"
                              title="Bearbeiten"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {report.status === "draft" && (
                            <button
                              onClick={() => handleSubmitReport(report.id)}
                              className="btn bg-blue-500 text-black hover:bg-blue-600 btn-sm"
                              title="Einreichen"
                            >
                              <FaPaperPlane />
                            </button>
                          )}
                          {report.deny_message != null &&
                            report.deny_message != "" && (
                              <button
                                onClick={() => handleOpenDenyMessage(report)}
                                className="btn bg-red-500 text-black hover:bg-red-600 btn-sm"
                                title="Ablehnungsgrund"
                              >
                                <FaCommentDots />
                              </button>
                            )}
                          <button
                            onClick={() => handleViewReport(report.id)}
                            className="btn bg-blue-500 text-black hover:bg-blue-600 btn-sm"
                            title="Bericht einsehen"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handlePrintView(report.id)}
                            className="btn bg-blue-500 text-black hover:bg-blue-600 btn-sm"
                            title="Druckansicht"
                          >
                            <FaPrint />
                          </button>
                          {report.status !== "approved" && (
                            <button
                              onClick={() => handleDeleteClick(report.id)}
                              className="btn bg-red-500 text-black hover:bg-red-600 btn-sm"
                              title="Löschen"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modale */}
      {selectedReport && (
        <ReportReviewModal
          report={selectedReport}
          onClose={handleCloseReviewModal}
        />
      )}
      {selectedPrintReport && (
        <ReportPrintModal
          report={selectedPrintReport}
          onClose={handleClosePrintModal}
        />
      )}
      {selectedEditReport && (
        <ReportEditModal
          report={selectedEditReport}
          onClose={handleCloseEditModal}
          onSave={handleUpdateReport}
        />
      )}
      {reportToDelete && (
        <ConfirmDeleteModal
          message="Sind Sie sicher, dass Sie diesen Eintrag löschen? Er wird endgültig gelöscht und kann nicht wiederhergestellt werden."
          onConfirm={confirmDeletion}
          onCancel={cancelDeletion}
          countdownSeconds={3}
        />
      )}
      {reportDenyMessageModal && (
        <div>
          <ModalMain
            title={"Ablehnungsgrund"}
            message={reportDenyMessageModal.deny_message}
            onClose={handleCloseDenyMessage}
          />
        </div>
      )}
    </div>
  );
}
