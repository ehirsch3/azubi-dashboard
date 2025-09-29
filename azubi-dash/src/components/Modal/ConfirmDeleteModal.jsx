import React, { useState, useEffect } from "react";

export default function ConfirmDeleteModal({
  message = "Sind Sie sicher, dass Sie diesen Eintrag löschen? Er wird endgültig gelöscht und kann nicht wiederhergestellt werden.",
  onConfirm,
  onCancel,
  countdownSeconds = 5, // default countdown duration in seconds
}) {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    // Reset countdown when modal opens
    setCountdown(countdownSeconds);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup the interval on component unmount or if countdownSeconds changes
    return () => clearInterval(interval);
  }, [countdownSeconds]);

  // Calculate the progress percentage for the linear progress bar
  const progressPercentage = ((countdownSeconds - countdown) / countdownSeconds) * 100;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Löschbestätigung</h3>
        <p className="mb-4">{message}</p>

        <div className="mb-4">
          <p>
            Bitte warten Sie <strong>{countdown}</strong> Sekunden, bevor Sie fortfahren.
          </p>
          <div className="w-full bg-gray-300 rounded h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onCancel} className="btn btn-secondary mr-2">
            Abbrechen
          </button>
          <button onClick={onConfirm} className="btn btn-error" disabled={countdown > 0}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
