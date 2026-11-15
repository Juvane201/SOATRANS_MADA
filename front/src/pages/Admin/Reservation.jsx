// frontend/src/pages/admin/Reservations.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${import.meta.env.VITE_API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReservations(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestion des Réservations</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Client</th>
              <th className="p-2">Voiture</th>
              <th className="p-2">Places</th>
              <th className="p-2">Destination</th>
              <th className="p-2">Frais</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-b">
                <td className="p-2">{reservation.client.nom} {reservation.client.prenom}</td>
                <td className="p-2">{reservation.voiture.numero_voiture}</td>
                <td className="p-2">{reservation.nombre_places_reservees}</td>
                <td className="p-2">{reservation.destination}</td>
                <td className="p-2">{reservation.frais} €</td>
                <td className="p-2">{new Date(reservation.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Reservations;