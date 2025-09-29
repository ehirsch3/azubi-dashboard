import axios from "axios";
import { useState, useEffect } from "react";
import Alert from "./components/Alert";
import AzubiTable from "./components/AzubiTable";

export default function Verwaltung() {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState(null);

  // Axios instance with Authorization header set for all requests
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api/",
    withCredentials: true, // Ensure cookies are included in the request
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("azubis"); // Use axios instance here
        setTableData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query); // Update search term state

    try {
      const response = await axiosInstance.get(`azubis/search?q=${query}`); // Use axios instance here
      setTableData(response.data); // Update table data with search results
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckboxChange = async (id_person, isChecked) => {
    try {
      const url = `azubis/${isChecked ? "create" : "delete"}/${id_person}`;
      await axiosInstance.put(url); // Use axios instance here

      // Update the local tableData state after making the request
      setTableData((prevData) =>
        prevData.map((azubi) =>
          azubi.id_person === id_person
            ? { ...azubi, apprentice: isChecked }
            : azubi
        )
      );

      // Show the alert based on whether the checkbox was checked or unchecked
      if (isChecked) {
        setAlertMessage("Person wurde erfolgreich als Azubi gekennzeichnet!");
        setShowAlert(true);
      } else {
        setAlertMessage("Person wurde erfolgreich als Azubi entfernt!");
        setShowAlert(true);
      }

      // Hide the alert after 4 seconds
      setTimeout(() => setShowAlert(false), 4000);
    } catch (err) {
      setError(`Error updating apprentice status: ${err.message}`);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Verwaltung</h1>
      <p className="text-sm text-600 mb-4">
        Dies ist eine Auflistung von allen Mitarbeitern die als Azubi
        gekennzeichnet werden können.
      </p>

      {showAlert && <Alert message={alertMessage} type="info" />}

      <div className="form-control">
        <input
          type="text"
          placeholder="Suchen..."
          value={searchTerm}
          onChange={handleSearch}
          className="input input-bordered w-32"
        />
      </div>

      <AzubiTable
        tableData={tableData}
        error={error}
        handleCheckboxChange={handleCheckboxChange}
      />
    </>
  );
}
