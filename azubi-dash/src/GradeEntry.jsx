import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "./components/Modal/ConfirmDeleteModal";

export default function GradeEntry() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newGrade, setNewGrade] = useState({
    id_subject: "",
    test_type: "",
    test_date: "",
    grade: "",
  });
  const [error, setError] = useState(null);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  // Axios instance
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api/",
    withCredentials: true,
  });

  useEffect(() => {
    fetchGrades();
    fetchSubjects();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axiosInstance.get("grades/my");
      setGrades(response.data);
    } catch (err) {
      setError("Fehler beim Laden der Noten");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get("grades/subjects");
      setSubjects(response.data);
    } catch (err) {
      setError("Fehler beim Laden der Fächer");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGrade((prev) => ({
      ...prev,
      [name]: name === "id_subject" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("grades", {
        id_subject: newGrade.id_subject,
        test_type: newGrade.test_type,
        test_date: newGrade.test_date,
        grade: newGrade.grade,
      });
      setNewGrade({ id_subject: "", test_type: "", test_date: "", grade: "" });
      fetchGrades();
    } catch (err) {
      setError("Fehler beim Hinzufügen der Note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`grades/${id}`);
      fetchGrades();
    } catch (err) {
      setError("Fehler beim Löschen der Note");
    }
  };

  const handleDeleteClick = (id) => {
    setGradeToDelete(id);
  };

  const confirmGradeDeletion = () => {
    if (gradeToDelete) {
      handleDelete(gradeToDelete);
      setGradeToDelete(null);
    }
  };

  const cancelGradeDeletion = () => {
    setGradeToDelete(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Meine Noten</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Grade Entry Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 mb-6">
        {/* Dropdown for Subjects */}
        <select
          name="id_subject"
          value={newGrade.id_subject || ""}
          onChange={handleInputChange}
          className="input input-bordered max-w-xs"
          required
        >
          <option value="">Wählen Sie ein Fach</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>

        {/* Dropdown for Testtyp */}
        <select
          name="test_type"
          value={newGrade.test_type}
          onChange={handleInputChange}
          className="input input-bordered max-w-xs"
          required
        >
          <option value="">Wählen Sie den Testtyp</option>
          <option value="Schulaufgabe">Schulaufgabe</option>
          <option value="Kurzarbeit">Kurzarbeit</option>
          <option value="Stegreifaufgabe">Stegreifaufgabe</option>
        </select>

        {/* Date Input */}
        <input
          type="date"
          name="test_date"
          value={newGrade.test_date}
          onChange={handleInputChange}
          className="input input-bordered max-w-xs"
          required
        />
        {/* Grade Input */}
        <input
          type="number"
          name="grade"
          placeholder="Note (1-6)"
          value={newGrade.grade}
          onChange={handleInputChange}
          className="input input-bordered max-w-xs"
          min="1"
          max="6"
          required
        />
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Hinzufügen
        </button>
      </form>

      {/* Grades Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Fach</th>
              <th>Testtyp</th>
              <th>Datum</th>
              <th>Note</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => {
              const subject = subjects.find((sub) => sub.id === grade.id_subject);
              return (
                <tr key={grade.id}>
                  <td>{subject ? subject.subject_name : "Unbekanntes Fach"}</td>
                  <td>{grade.test_type}</td>
                  <td>{new Date(grade.test_date).toLocaleDateString()}</td>
                  <td>{grade.grade}</td>
                  <td>
                    <button onClick={() => handleDeleteClick(grade.id)} className="btn btn-error btn-xs">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {gradeToDelete && (
        <ConfirmDeleteModal
          message="Sind Sie sicher, dass Sie diese Note löschen?"
          onConfirm={confirmGradeDeletion}
          onCancel={cancelGradeDeletion}
          countdownSeconds={3}
        />
      )}
    </div>
  );
}
