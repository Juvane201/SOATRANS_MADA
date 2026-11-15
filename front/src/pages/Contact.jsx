// frontend/src/pages/Contact.jsx
function Contact() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Contactez-nous</h1>
        <form className="space-y-4 max-w-md mx-auto">
          <input type="text" placeholder="Nom" className="w-full p-2 border rounded" required />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" required />
          <textarea placeholder="Message" className="w-full p-2 border rounded" rows="5" required></textarea>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer</button>
        </form>
      </div>
    );
  }
  
  export default Contact;