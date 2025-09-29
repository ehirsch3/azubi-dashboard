import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportReviewModal from "./components/Modal/ReportReviewModal";
import ReportDenyModal from "./components/Modal/ReportDenyModal";

// Mapping des Status ins Deutsche
const statusMapping = {
  draft: "Entwurf",
  submitted: "Eingereicht",
  approved: "Genehmigt",
};

export default function ReviewReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDeclineModal, setOpenDeclineModal] = useState(null);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ column: null, direction: "asc" });
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api/",
    withCredentials: true,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get("reports");
      // Filter for only submitted reports
      const submittedReports = response.data.filter(
        (report) => report.status === "submitted"
      );
      setReports(submittedReports);
    } catch (err) {
      setError(err.message);
    }
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

      // Bei "name" setzen wir den kompletten Namen zusammen
      if (sortConfig.column === "name") {
        aVal = (a.firstname || "") + " " + (a.lastname || "");
        bVal = (b.firstname || "") + " " + (b.lastname || "");
      }
      if (sortConfig.column === "status") {
        aVal = aVal || "";
        bVal = bVal || "";
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleApproveReport = async (id) => {
    try {
      await axiosInstance.put(`reports/${id}/approve`, { approved_by: 1 });
      fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeclineReport = async (id, deny_message) => {
    try {
      await axiosInstance.put(`reports/${id}/decline`, {deny_message: deny_message} );
      fetchReports();
      setOpenDeclineModal(null);
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

  const handleCloseModal = () => {
    setSelectedReport(null);
    setOpenDeclineModal(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Zu genehmigende Berichte</h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {reports.length === 0 ? (
        <p className="text-center">Es gibt keine Berichte, die auf Genehmigung warten.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-200">
            <thead className="">
              <tr>
                <th 
                  onClick={() => handleSort("name")} 
                  className="cursor-pointer px-4 py-2 text-center"
                >
                  Name {sortConfig.column === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("calendar_week")} 
                  className="cursor-pointer px-4 py-2 text-center"
                >
                  Kalenderwoche {sortConfig.column === "calendar_week" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("year")} 
                  className="cursor-pointer px-4 py-2 text-center"
                >
                  Jahr {sortConfig.column === "year" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("status")} 
                  className="cursor-pointer px-4 py-2 text-center"
                >
                  Status {sortConfig.column === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th 
                  onClick={() => handleSort("class_name")} 
                  className="cursor-pointer px-4 py-2 text-center"
                >
                  Klasse {sortConfig.column === "class_name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {sortedReports().map((report) => (
                <tr key={report.id} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-center">
                    {report.firstname && report.lastname
                      ? `${report.firstname} ${report.lastname}`
                      : "Unbekannt"}
                  </td>
                  <td className="px-4 py-2 text-center">{report.calendar_week}</td>
                  <td className="px-4 py-2 text-center">{report.year}</td>
                  <td className={`px-4 py-2 text-center ${report.status === "draft" ? "text-orange-500" : report.status === "submitted" ? "text-yellow-500" : "text-green-500"}`}>
                    {statusMapping[report.status] || report.status}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {report.class_name_snapshot || report.class_name || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleViewReport(report.id)}
                      className="btn btn-info btn-sm"
                      title="Bericht ansehen"
                    >
                      Bericht ansehen
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleApproveReport(report.id)}
                      className="btn btn-success btn-sm"
                      title="Genehmigen"
                    >
                      Genehmigen
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setOpenDeclineModal(report)}
                      className="btn btn-error btn-sm"
                      title="Ablehnen"
                    >
                      Ablehnen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-center">
        <button onClick={() => navigate("/home")} className="btn">
          Zurück zur Startseite
        </button>
      </div>

      {/* Modal for selected report */}
      {selectedReport && (
        <ReportReviewModal report={selectedReport} onClose={handleCloseModal} />
      )}

      {/* Modal for denying a report */}
      {openDeclineModal && (
        <ReportDenyModal
          report={openDeclineModal}
          onDeny={handleDeclineReport}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
