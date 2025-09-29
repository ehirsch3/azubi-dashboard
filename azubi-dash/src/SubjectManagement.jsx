import { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './components/Alert';
import ConfirmDeleteModal from './components/Modal/ConfirmDeleteModal';
import Checkbox from './components/Checkbox';

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [apprentices, setApprentices] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedApprentices, setSelectedApprentices] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [error, setError] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [subjectToDelete, setSubjectToDelete] = useState(null); // For deletion confirmation

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3002/api/',
    withCredentials: true, // Ensure cookies are included in the request
  });

  useEffect(() => {
    fetchSubjects();
    fetchApprentices();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get('subjects');
      setSubjects(response.data);
    } catch (err) {
      setError('Error fetching subjects: ' + err.message);
    }
  };

  const fetchApprentices = async () => {
    try {
      const response = await axiosInstance.get('apprentices');
      setApprentices(response.data);
    } catch (err) {
      setError('Error fetching apprentices: ' + err.message);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName) return;

    try {
      await axiosInstance.post('subjects', { subject_name: newSubjectName });
      setAlertMessage('Neues Fach erfolgreich erstellt!');
      setShowAlert(true);
      fetchSubjects(); // Refresh the list of subjects
      setNewSubjectName('');
    } catch (err) {
      setError('Error creating subject: ' + err.message);
    }
  };

  const handleDeleteClick = (id) => {
    setSubjectToDelete(id);
  };
  
  const confirmSubjectDeletion = async () => {
    if (!subjectToDelete) return;
    try {
      await axiosInstance.delete(`subjects/${subjectToDelete}`);
      setAlertMessage('Fach erfolgreich gelöscht!');
      setShowAlert(true);
      fetchSubjects(); // Refresh the list of subjects
      setSubjectToDelete(null);
    } catch (err) {
      setError('Error deleting subject: ' + err.message);
    }
  };
  

 const handleSubjectSelection = (subjectId) => {
  setSelectedSubjects((prevSelectedSubjects) => {
    if (prevSelectedSubjects.includes(subjectId)) {
      return prevSelectedSubjects.filter((id) => id !== subjectId);
    } else {
      return [...prevSelectedSubjects, subjectId];
    }
  });
};

const handleApprenticeSelection = (apprenticeId) => {
  setSelectedApprentices((prevSelectedApprentices) => {
    if (prevSelectedApprentices.includes(apprenticeId)) {
      return prevSelectedApprentices.filter((id) => id !== apprenticeId);
    } else {
      return [...prevSelectedApprentices, apprenticeId];
    }
  });
};


  const handleAssignSubjectToApprentice = async () => {
    try {
      if (selectedSubjects.length === 0 || selectedApprentices.length === 0) {
        setAlertMessage('Bitte wählen Sie mindestens einen Azubi und ein Fach aus!');
        setShowAlert(true);
        return;
      }
  
      await axiosInstance.post('assign-subject', {
        id_person: selectedApprentices,
        id_subjects: selectedSubjects,
      });
  
      setAlertMessage('Fächer erfolgreich zugewiesen!');
      setShowAlert(true);
  
      // Reset selected checkboxes after assignment
      setSelectedSubjects([]);
      setSelectedApprentices([]);
  
      fetchSubjects(); // Refresh the list of subjects
    } catch (err) {
      setError('Error assigning subjects: ' + err.message);
    }
  };
  
  const handleRemoveSubjectFromApprentice = async () => {
    try {
      if (selectedSubjects.length === 0 || selectedApprentices.length === 0) {
        setAlertMessage('Bitte wählen Sie mindestens einen Azubi und ein Fach aus!');
        setShowAlert(true);
        return;
      }
  
      await axiosInstance.post('remove-subject', {
        id_person: selectedApprentices,
        id_subjects: selectedSubjects,
      });
  
      setAlertMessage('Zuweisung erfolgreich aufgehoben!');
      setShowAlert(true);
  
      // Reset selected checkboxes after removal
      setSelectedSubjects([]);
      setSelectedApprentices([]);
  
      fetchSubjects(); // Refresh the list of subjects
    } catch (err) {
      setError('Fehler beim Entfernen der Zuweisung: ' + err.message);
    }
  };
  


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Subject Management Card */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6">Fächerverwaltung</h2>
          
          {/* Create Subject Form */}
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Neues Fach erstellen"
              className="input input-bordered flex-grow"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSubject()}
            />
            <button 
              onClick={handleCreateSubject} 
              className="btn btn-primary gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Erstellen
            </button>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body flex-row justify-between items-center p-4">
                  <h3 className="text-lg font-semibold">{subject.subject_name}</h3>
                  <button
                    onClick={() => handleDeleteClick(subject.id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apprentice Assignment Card */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6">Azubis zuweisen</h2>
          
          {/* Apprentices List */}
          <div className="space-y-6">
            {apprentices.map((apprentice) => (
              <div key={apprentice.id_person} className="card bg-base-200 shadow-sm">
                <div className="card-body space-y-4">
                  <div className="flex items-center justify-between">
                  <Checkbox
  checked={selectedApprentices.includes(apprentice.id_person)}
  onChange={() => handleApprenticeSelection(apprentice.id_person)}
  label={`${apprentice.firstname} ${apprentice.lastname}`}
  labelClassName="text-lg font-medium"
  className="bg-base-100 p-3 rounded-box shadow-sm"
/>


                    <span className="badge badge-lg badge-neutral">
                      {apprentice.subject_name || 'Kein Fach'}
                    </span>
                  </div>

                  {/* Subjects Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
  {subjects.map((subject) => (
    <Checkbox
    key={subject.id}
    onChange={() => handleSubjectSelection(subject.id)}
    label={subject.subject_name}
    labelClassName="text-lg font-medium"
  className="bg-base-100 p-3 rounded-box shadow-sm"
  />
  
  ))}
</div>

                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleAssignSubjectToApprentice}
              className="btn btn-primary flex-1 gap-2"
              disabled={selectedSubjects.length === 0 || selectedApprentices.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Zuweisen
            </button>
            
            <button
              onClick={handleRemoveSubjectFromApprentice}
              className="btn btn-outline btn-error flex-1 gap-2"
              disabled={selectedSubjects.length === 0 || selectedApprentices.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Zuweisung aufheben
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {subjectToDelete && (
        <ConfirmDeleteModal
          message="Sind Sie sicher, dass Sie dieses Fach löschen? Es wird endgültig entfernt und kann nicht wiederhergestellt werden."
          onConfirm={confirmSubjectDeletion}
          onCancel={() => setSubjectToDelete(null)}
          countdownSeconds={3}
        />
      )}

      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          className="alert-success fixed bottom-4 right-4 w-auto"
        />
      )}
    
      {/* Confirmation modal for subject deletion */}
      {subjectToDelete && (
        <ConfirmDeleteModal
          message="Sind Sie sicher, dass Sie dieses Fach löschen? Es wird endgültig entfernt und kann nicht wiederhergestellt werden."
          onConfirm={confirmSubjectDeletion}
          onCancel={() => setSubjectToDelete(null)}
          countdownSeconds={3}
        />
      )}

    </div>
  );
}
