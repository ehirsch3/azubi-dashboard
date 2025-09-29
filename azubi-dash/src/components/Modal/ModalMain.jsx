export default function ModalMain({ message, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded shadow-lg w-full max-w-md">
        <strong>{title}</strong>
        <p>{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
