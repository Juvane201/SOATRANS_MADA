// frontend/src/pages/admin/Historique.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

function Historique() {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${import.meta.env.VITE_API_URL}/factures`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFactures(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Historique des Factures</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Client</th>
              <th className="p-2">Voiture</th>
              <th className="p-2">Places</th>
              <th className="p-2">Destination</th>
              <th className="p-2">Frais</th>
              <th className="p-2">Heure de départ</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {factures.map((facture) => (
              <tr key={facture.id} className="border-b">
                <td className="p-2">{facture.client.nom} {facture.client.prenom}</td>
                <td className="p-2">{facture.voiture.numero_voiture}</td>
                <td className="p-2">{facture.nombre_places_reservees}</td>
                <td className="p-2">{facture.destination}</td>
                <td className="p-2">{facture.frais} €</td>
                <td className="p-2">{facture.heure_depart}</td>
                <td className="p-2">{new Date(facture.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Historique;