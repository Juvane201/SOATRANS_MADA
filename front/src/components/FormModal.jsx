// frontend/src/components/FormModal.jsx
function FormModal({ isOpen, onClose, title, onSubmit, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <form onSubmit={onSubmit} encType="multipart/form-data">
            {children}
            <div className="flex justify-end mt-4 space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default FormModal;