// ReportEditModal.jsx
import axios from "axios";
import { set } from "date-fns";
import { useEffect, useState } from "react";

export default function ReportEditModal({ report, onClose, onSave }) {
  const [formData, setFormData] = useState(report);
  const [showSubjects, setShowSubjects] = useState([]);
  const [showS, setShowS] = useState(false);
  const [subjects, setSubjects] = useState([]);

    // Axios instance
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3002/api/",
      withCredentials: true,
    });


// useEffect(() => {

// try {
  
//   report.school_content = JSON.parse(report.school_content);
//   console.log(report.school_content);

//   setFormData(report);
// } catch (err) {
//   console.error(err);
// }
    
//   }, []);

useEffect(() => {
  console.log("FormData ->", formData);
},[formData]);


  // Handle input changes for simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSchoolChange = (e, subject) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, school_content: { ...prev.school_content, [subject.subject_name]: value} }));
    console.log("form school ->",formData);
  };

  // Handle changes for the days array
  const handleDayChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDays = [...formData.days];
    updatedDays[index] = { ...updatedDays[index], [name]: value };
    setFormData((prev) => ({ ...prev, days: updatedDays }));

    setShowSubjects((prevShowSubjects) => {
      if (prevShowSubjects.map((obj) => obj.index).includes(index)) {
        return prevShowSubjects.map((obj) =>
          obj.index === index ? { index, value } : obj
        );
      }
      return [...prevShowSubjects, {index: index, value: value}];
    });
  };


  const handleSubmit = (e) => {


    e.preventDefault();
    onSave(formData);
  };

  useEffect(() => {
    let school = formData.days.find((obj) => obj.type === "Berufsschultag");
    

    let isSchule = showSubjects.find((obj) => obj.value === "Berufsschultag");
    
    if (isSchule && !showS || school) {
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

  
  

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">Bericht bearbeiten</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Kalenderwoche</label>
            <input
              type="number"
              name="calendar_week"
              value={formData.calendar_week}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Jahr</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Berichtsinhalte</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>

  

          {subjects.length > 0 && showS && (
            subjects.map((subject, index) => (
              <div key={index} className="mb-3">  
              <label htmlFor="subject" className="block text-sm font-medium text-white-600 mb-1">
                {subject.subject_name}
                  </label>
                  <textarea
                    id="school_content"
                    name="school_content"
                    placeholder="Inhalte eingeben..."
                    value={formData.school_content[subject.subject_name]}
                    onChange={(e) =>handleSchoolChange(e, subject)}
                    className="textarea textarea-bordered w-full text-sm h-18"
                    required
                  ></textarea>
                  </div>
                ))
              )
            }

      


          {/* Iterate over the days */}
          {formData.days.map((day, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1">
                {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"][index]}
              </label>
              <select
                name="type"
                value={day.type}
                onChange={(e) => handleDayChange(e, index)}
                className="input input-bordered w-full"
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
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="btn btn-secondary mr-2">
              Abbrechen
            </button>
            <button type="submit" className="btn btn-primary">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
