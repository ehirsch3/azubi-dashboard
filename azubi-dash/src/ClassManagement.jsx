// ClassManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './components/Alert';
import ConfirmDeleteModal from './components/Modal/ConfirmDeleteModal';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);  // To store classes
  const [apprentices, setApprentices] = useState([]);  // To store apprentices
  const [selectedClass, setSelectedClass] = useState(null);  // Selected class for assignment
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [error, setError] = useState(null);
  const [newClassName, setNewClassName] = useState('');
  const [classToDelete, setClassToDelete] = useState(null); // For deletion confirmation

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3002/api/',
    withCredentials: true, // Ensure cookies are included in the request
  });

  // Fetch all classes and apprentices when the component mounts
  useEffect(() => {
    fetchClasses();
    fetchApprentices();
  }, []);

  // Fetch classes from the backend
  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('classes');
      setClasses(response.data);
    } catch (err) {
      setError('Error fetching classes: ' + err.message);
    }
  };

  // Fetch apprentices from the backend
  const fetchApprentices = async () => {
    try {
      const response = await axiosInstance.get('apprentices');
      setApprentices(response.data);
    } catch (err) {
      setError('Error fetching apprentices: ' + err.message);
    }
  };

  const handleAssignApprentice = async (id_person) => {
    if (!selectedClass) return;  // If no class is selected, do nothing
  
    try {
      await axiosInstance.post('assign-class', {
        id_person,
        id_class: selectedClass,
      });
  
      setAlertMessage('Azubi erfolgreich der Klasse zugewiesen!');
      setShowAlert(true);
      fetchClasses(); // Refresh the list of classes to show updated data
    } catch (err) {
      setError('Error assigning apprentice: ' + err.message);
    }
  };

  const handleUnassignApprentice = async (id_person) => {
    if (!selectedClass) return; // Ensure a class is selected
  
    try {
      // Send a POST request with id_person and id_class
      await axiosInstance.post('remove-class', {
        id_person,
        id_class: selectedClass,
      });
  
      setAlertMessage('Azubi erfolgreich aus der Klasse entfernt!');
      setShowAlert(true);
      fetchClasses(); // Refresh the class list to reflect changes
    } catch (err) {
      setError('Error unassigning apprentice: ' + err.message);
    }
  };

  // Handle creating a new class
  const handleCreateClass = async () => {
    if (!newClassName) return;

    try {
      await axiosInstance.post('classes', { class_name: newClassName });
      setAlertMessage('Neue Klasse erfolgreich erstellt!');
      setShowAlert(true);
      fetchClasses(); // Refresh the list of classes
      setNewClassName('');  // Reset input field
    } catch (err) {
      setError('Error creating class: ' + err.message);
    }
  };

  // Open deletion confirmation modal for a specific class
  const handleDeleteClick = (id) => {
    setClassToDelete(id);
  };

  // Called from the deletion modal when the user confirms deletion
  const confirmClassDeletion = async () => {
    if (!classToDelete) return;
    try {
      await axiosInstance.delete(`classes/${classToDelete}`);
      setAlertMessage('Klasse erfolgreich gelöscht!');
      setShowAlert(true);
      fetchClasses(); // Refresh the list of classes
      setClassToDelete(null);
    } catch (err) {
      setError('Error deleting class: ' + err.message);
    }
  };

  // Called from the deletion modal to cancel deletion
  const cancelClassDeletion = () => {
    setClassToDelete(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Klasseneinteilung</h1>
      {showAlert && <Alert message={alertMessage} type="info" />}
      {error && <Alert message={error} type="error" />}

      {/* Class Management Table */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Klassenverwaltung</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Neue Klasse erstellen"
            className="input input-bordered w-64"
          />
          <button onClick={handleCreateClass} className="btn btn-primary ml-2">
            Erstellen
          </button>
        </div>
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Klassenname</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.class_name}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(cls.id)}
                    className="btn btn-sm btn-error"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apprentice Assignment Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Azubis zuweisen</h2>
        <select
          className="select select-bordered w-full mb-4"
          onChange={(e) => setSelectedClass(e.target.value)}
          value={selectedClass || ''}
        >
          <option value="">Klasse auswählen</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name}
            </option>
          ))}
        </select>
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Azubi</th>
              <th>Aktuelle Klasse</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {apprentices.map((apprentice) => (
              <tr key={apprentice.id_person}>
                <td>{`${apprentice.firstname} ${apprentice.lastname}`}</td>
                <td>{apprentice.class_name || 'Keine Klasse'}</td>
                <td>
                  {selectedClass && (
                    <>
                      <button
                        onClick={() => handleAssignApprentice(apprentice.id_person)}
                        className="btn btn-sm btn-primary mr-2"
                      >
                        Zuweisen
                      </button>
                      <button
                        onClick={() => handleUnassignApprentice(apprentice.id_person)}
                        className="btn btn-sm btn-secondary"
                      >
                        Entfernen
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation modal for class deletion */}
      {classToDelete && (
        <ConfirmDeleteModal
          message="Sind Sie sicher, dass Sie diese Klasse löschen? Sie wird endgültig entfernt und kann nicht wiederhergestellt werden."
          onConfirm={confirmClassDeletion}
          onCancel={cancelClassDeletion}
          countdownSeconds={3} // adjust countdown duration if needed
        />
      )}
    </>
  );
}
