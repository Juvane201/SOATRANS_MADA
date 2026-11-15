// frontend/src/pages/Reserver.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';

function Reserver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voiture, setVoiture] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/voitures/${id}`).then((res) => setVoiture(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      client: {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        cin: formData.get('cin'),
      },
      voiture_id: id,
      nombre_places_reservees: parseInt(formData.get('nombre_places')),
      frais: voiture.frais,
      destination: voiture.destination,
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/reservations`, data);
    await axios.post(`${import.meta.env.VITE_API_URL}/factures`, {
      ...data,
      heure_depart: voiture.heure_depart,
    });
    alert('Réservation effectuée avec succès !');
    navigate('/');
  };

  if (!voiture) return <div>Chargement...</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Réserver : {voiture.numero_voiture}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" placeholder="Nom" className="w-full p-2 border rounded" required />
        <input name="prenom" placeholder="Prénom" className="w-full p-2 border rounded" required />
        <input name="cin" placeholder="CIN" className="w-full p-2 border rounded" required />
        <input
          name="nombre_places"
          type="number"
          placeholder="Nombre de places"
          className="w-full p-2 border rounded"
          max={voiture.nombre_places}
          required
        />
        <p>Frais : {voiture.frais} €</p>
        <p>Destination : {voiture.destination}</p>
        <p>Heure de départ : {voiture.heure_depart}</p>
        <Button type="submit">Confirmer la réservation</Button>
      </form>
    </div>
  );
}

export default Reserver;