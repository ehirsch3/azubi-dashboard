import { useState } from "react";

export default function ReportDenyModal({ report, onClose, onDeny }) {
  const [denyMessage, setDenyMessage] = useState(report.deny_message || "");
  const [errorMessage, setErrorMessage] = useState(false);

  const handleChange = (e) => {
    setDenyMessage(e.target.value);
  };

  const handleSave = () => {
    console.log("Deny Message ->", denyMessage);
    if(!denyMessage) {
        setErrorMessage(true);
        return;
    };


    onDeny(report.id, denyMessage);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Ablehnungsgrund</h2>
        {errorMessage && <p className="text-red-500 text-sm mb-4">Bitte geben Sie den Grund für die Ablehnung ein.</p>}
        <textarea
          id="denyMessage"
          name="denyMessage"
          value={denyMessage}
          onChange={handleChange}
          placeholder="Bitte geben Sie den Grund für die Ablehnung ein."
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-sm mb-4"
          required
        />
        <div className="flex justify-end space-x-2">
            <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
          >
            Schicken    
          </button>
          
        </div>
      </div>
    </div>
  );
}
