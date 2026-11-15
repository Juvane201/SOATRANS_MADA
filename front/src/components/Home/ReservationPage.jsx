import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Car, ArrowLeft, CheckCircle, CreditCard, User, Phone, 
  Mail, MapPin, Calendar, Users, Shield, Clock, Loader2,
  Star, Award, Wifi, Coffee, Battery, Luggage,
  AlertCircle, ChevronRight, ChevronLeft, Download,
  Printer, Heart, Sparkles, Target, Navigation,
  FileText, Receipt, Ticket, Info, Settings,
  Globe, Map as MapIcon, Watch, Zap, Sun,
  Moon, Cloud, Wind, Thermometer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // 👈 IMPORT CORRIGÉ

const ReservationPage = () => {
  const { voitureId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    voiture: true,
    reservation: false,
    facture: false
  });
  const [voiture, setVoiture] = useState(null);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre_places_reservees: 1,
    place_reserver: '',
    nom_client: '',
    prenom_client: '',
    tel_client: '',
    sexe_client: 'M',
    date_voyage: '',
    cin_client: '',
    adresse_client: '',
    nationalite: 'Malagasy',
    notes_speciales: ''
  });

  const [errors, setErrors] = useState({});

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  useEffect(() => {
    const fetchVoiture = async () => {
      try {
        setLoading(prev => ({ ...prev, voiture: true }));
        const response = await api.get(`/voitures/${voitureId}`);
        setVoiture(response.data.data);
        setFormData(prev => ({
          ...prev,
          date_voyage: response.data.data.date_voyage
        }));
      } catch (error) {
        console.error('Erreur:', error);
        alert('Voiture non trouvée');
        navigate('/');
      } finally {
        setLoading(prev => ({ ...prev, voiture: false }));
      }
    };

    fetchVoiture();
  }, [voitureId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom_client) newErrors.nom_client = 'Nom requis';
    if (!formData.prenom_client) newErrors.prenom_client = 'Prénom requis';
    if (!formData.tel_client) newErrors.tel_client = 'Téléphone requis';
    if (!formData.cin_client) newErrors.cin_client = 'CIN requis';
    
    if (!formData.nombre_places_reservees || formData.nombre_places_reservees < 1) {
      newErrors.nombre_places_reservees = 'Au moins 1 place requise';
    }
    if (formData.nombre_places_reservees > (voiture?.places_disponibles || 0)) {
      newErrors.nombre_places_reservees = `Maximum ${voiture?.places_disponibles} places`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateInvoice = async (reservation, facture) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Couleurs modernes
    const primaryColor = [30, 64, 175]; 
    const accentColor = [20, 184, 166]; 
    const lightGray = [248, 250, 252];
    const darkText = [30, 41, 59];

    // --- EN-TÊTE ---
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Logo / Nom
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SOATRANS', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Transport de voyageurs', 20, 35);

    // Numéro de facture
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`FACTURE #${facture.numero_facture}`, pageWidth - 20, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, 35, { align: 'right' });

    // --- INFORMATIONS CLIENT & ENTREPRISE ---
    let yPos = 60;
    
    // Bloc Client (Fond gris clair)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(20, yPos, (pageWidth / 2) - 25, 45, 3, 3, 'F');
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURÉ À :', 25, yPos + 8);
    
    doc.setFontSize(12);
    doc.text(`${formData.nom_client.toUpperCase()} ${formData.prenom_client}`, 25, yPos + 18);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`CIN : ${formData.cin_client}`, 25, yPos + 26);
    doc.text(`Téléphone : ${formData.tel_client}`, 25, yPos + 32);
    doc.text(`Adresse : ${formData.adresse_client || 'Non renseignée'}`, 25, yPos + 38);

    // Bloc Détails Paiement (Droite)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect((pageWidth / 2) + 5, yPos, (pageWidth / 2) - 25, 45, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS :', (pageWidth / 2) + 10, yPos + 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date d'émission : ${new Date().toLocaleDateString('fr-FR')}`, (pageWidth / 2) + 10, yPos + 18);
    doc.text(`Mode de paiement : À l'embarquement`, (pageWidth / 2) + 10, yPos + 26);
    doc.text(`Statut : Confirmé`, (pageWidth / 2) + 10, yPos + 34);

    yPos += 60;

    // --- DÉTAILS DU VOYAGE ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('DÉTAILS DU VOYAGE', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Trajet : ${voiture.ville_depart} vers ${voiture.destination}`, 20, yPos);
    doc.text(`Date de départ : ${new Date(voiture.date_voyage).toLocaleDateString('fr-FR')} à ${voiture.heure_depart}`, 20, yPos + 7);
    doc.text(`Véhicule : ${voiture.numero_voiture}`, 20, yPos + 14);
    doc.text(`Places réservées : ${formData.nombre_places_reservees}`, 20, yPos + 21);
    if(formData.place_reserver) {
      doc.text(`Places spécifiques : ${formData.place_reserver}`, 20, yPos + 28);
      yPos += 7;
    }

    yPos += 35;

    // --- TABLEAU DES PRIX ---
    const totalAmount = (voiture?.frais || 0) * formData.nombre_places_reservees;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Détails', 'Montant']],
      body: [
        ['Prix par place', `${formData.nombre_places_reservees} place(s)`, `${(voiture?.frais || 0).toLocaleString()} Ar`],
        ['', 'Sous-total', `${totalAmount.toLocaleString()} Ar`],
        ['', 'TVA (20%)', `${(totalAmount * 0.2).toLocaleString()} Ar`],
        ['', 'Total TTC', `${(totalAmount * 1.2).toLocaleString()} Ar`]
      ],
      theme: 'striped',
      headStyles: { 
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkText
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 60, halign: 'right' },
        2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 20, right: 20 },
      didParseCell: function(data) {
        // Mettre en évidence la ligne du total TTC
        if (data.row.index === 3 && data.section === 'body') {
          data.cell.styles.fillColor = [232, 244, 253]; // Bleu très clair
          data.cell.styles.textColor = primaryColor;
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 12;
        }
      }
    });

    // --- PIED DE PAGE ---
    const finalY = doc.lastAutoTable.finalY + 20;
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Ce document est généré automatiquement. Référence de réservation: ${reservation.reference}`,
      pageWidth / 2,
      finalY,
      { align: 'center' }
    );
    
    doc.text(
      `SOATRANS - Service Client : +261 34 80 146 56 - contact@soatrans.mg`,
      pageWidth / 2,
      finalY + 5,
      { align: 'center' }
    );

    return doc;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, reservation: true, facture: true }));
      
      // ÉTAPE 1 : VÉRIFICATION
      console.log("⏳ ÉTAPE 1 : Envoi de la vérification de disponibilité...");
      const checkResponse = await api.post('/reservations/check-availability', {
        voiture_id: voitureId,
        date_voyage: formData.date_voyage,
        nombre_places: formData.nombre_places_reservees,
        place_reserver: formData.place_reserver
      }, { timeout: 0 });

      console.log("✅ ÉTAPE 1 RÉUSSIE. Réponse :", checkResponse.data);

      if (!checkResponse.data.available) {
        alert(checkResponse.data.message || 'Places non disponibles');
        return;
      }

      // ÉTAPE 2 : RÉSERVATION
      console.log("⏳ ÉTAPE 2 : Envoi de la création de la réservation...");
      const reservationResponse = await api.post('/reservations/public', {
        ...formData,
        voiture_id: voitureId,
        statut: 'confirmée'
      }, { timeout: 0 });

      console.log("✅ ÉTAPE 2 RÉUSSIE. Réservation créée :", reservationResponse.data);
      const reservation = reservationResponse.data.data;
      setReservationData(reservation);

      // ÉTAPE 3 : FACTURE
      console.log("⏳ ÉTAPE 3 : Envoi de la création de la facture...");
      const factureResponse = await api.post('/factures', {
        reservation_id: reservation.id,
        montant_total: (voiture?.frais || 0) * formData.nombre_places_reservees * 1.2,
      }, { timeout: 0 });

      console.log("✅ ÉTAPE 3 RÉUSSIE. Facture créée :", factureResponse.data);
      const facture = factureResponse.data.data; 

      // ÉTAPE 4 : PDF
      console.log("⏳ ÉTAPE 4 : Génération du PDF...");
      const pdf = await generateInvoice(reservation, facture);
      pdf.save(`facture_${facture.numero_facture}.pdf`);
      console.log("✅ ÉTAPE 4 RÉUSSIE. PDF téléchargé.");

      setShowSuccess(true);
      setStep(3);

      setTimeout(() => {
        navigate(`/reservation-confirmee/${reservation.reference}`);
      }, 5000);

    } catch (error) {
      console.error("🚨 ERREUR ATTRAPÉE DANS handleSubmit");
      console.error("Message :", error.message);
      
      if (error.response) {
        console.error("Statut HTTP :", error.response.status);
        console.error("Données de l'erreur :", error.response.data);
      }
      
      alert(error.response?.data?.message || 'Erreur lors de la réservation. Regardez la console (F12).');
    } finally {
      setLoading(prev => ({ ...prev, reservation: false, facture: false }));
    }
  };

  if (loading.voiture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Car className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-blue-400 animate-pulse" />
          </div>
          <p className="text-white mt-6 text-lg animate-pulse">Chargement des détails du voyage...</p>
        </div>
      </div>
    );
  }

  if (!voiture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md">
          <Car className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Voiture non trouvée</h2>
          <p className="text-gray-600 mb-8">Le véhicule que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-2xl text-center border border-green-200">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-400 rounded-full animate-ping opacity-20"></div>
            <div className="relative z-10 w-full h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Réservation confirmée !
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Votre facture a été téléchargée automatiquement.
            Vous allez être redirigé vers la page de confirmation...
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <p className="text-lg text-gray-800 mb-2">
              <span className="font-bold">Référence: </span>
              <span className="font-mono text-blue-600">{reservationData?.reference}</span>
            </p>
            <p className="text-gray-600">
              Un SMS de confirmation a été envoyé au {formData.tel_client}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(`/reservation-confirmee/${reservationData?.reference}`)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Voir la confirmation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="bg-white shadow-lg border-b sticky top-0 z-10 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour
            </button>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Réservation express</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 sticky top-24">
              <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden group">
                {voiture.image_url ? (
                  <img
                    src={voiture.image_url}
                    alt={voiture.numero_voiture}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-32 h-32 text-gray-600 animate-pulse" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="absolute top-6 left-6 flex space-x-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl shadow-lg">
                    {voiture.numero_voiture}
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg">
                    {voiture.places_disponibles} places disponibles
                  </span>
                </div>

                <div className="absolute bottom-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-2xl">
                    <span className="text-sm text-gray-600">Prix par place</span>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                      {voiture.frais.toLocaleString()} Ar
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {voiture.ville_depart} → {voiture.destination}
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5">
                    <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Date de départ</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(voiture.date_voyage).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5">
                    <Clock className="w-6 h-6 text-teal-600 mb-2" />
                    <p className="text-sm text-gray-600">Heure de départ</p>
                    <p className="text-xl font-bold text-gray-900">{voiture.heure_depart}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Avis clients</h3>
                  </div>
                  <p className="text-gray-600 italic">
                    "Excellent service, ponctuel et confortable !"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Réserver votre place
                  </h2>
                  <p className="text-gray-600">
                    Remplissez vos informations pour finaliser la réservation
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-white" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    Nombre de places
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        nombre_places_reservees: Math.max(1, prev.nombre_places_reservees - 1)
                      }))}
                      className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                      disabled={formData.nombre_places_reservees <= 1}
                    >
                      <ChevronLeft className="w-6 h-6 text-blue-600" />
                    </button>
                    
                    <div className="text-center">
                      <span className="text-5xl font-bold text-blue-600">
                        {formData.nombre_places_reservees}
                      </span>
                      <p className="text-gray-500 mt-1">place(s)</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        nombre_places_reservees: Math.min(voiture.places_disponibles, prev.nombre_places_reservees + 1)
                      }))}
                      className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                      disabled={formData.nombre_places_reservees >= voiture.places_disponibles}
                    >
                      <ChevronRight className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>
                  
                  {errors.nombre_places_reservees && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.nombre_places_reservees}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Places spécifiques (optionnel)
                  </label>
                  <input
                    type="text"
                    name="place_reserver"
                    placeholder="Ex: 1,2,3"
                    value={formData.place_reserver}
                    onChange={(e) => setFormData({...formData, place_reserver: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                  />
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    Laissez vide pour une attribution automatique
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    Informations personnelles
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="nom_client"
                        required
                        value={formData.nom_client}
                        onChange={(e) => setFormData({...formData, nom_client: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                          errors.nom_client ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.nom_client && (
                        <p className="text-red-600 text-sm mt-1">{errors.nom_client}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom_client"
                        required
                        value={formData.prenom_client}
                        onChange={(e) => setFormData({...formData, prenom_client: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                          errors.prenom_client ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.prenom_client && (
                        <p className="text-red-600 text-sm mt-1">{errors.prenom_client}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CIN / Passeport *
                      </label>
                      <input
                        type="text"
                        name="cin_client"
                        required
                        value={formData.cin_client}
                        onChange={(e) => setFormData({...formData, cin_client: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                          errors.cin_client ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 1010123456789"
                      />
                      {errors.cin_client && (
                        <p className="text-red-600 text-sm mt-1">{errors.cin_client}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="tel_client"
                        required
                        value={formData.tel_client}
                        onChange={(e) => setFormData({...formData, tel_client: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                          errors.tel_client ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 034 12 345 67"
                      />
                      {errors.tel_client && (
                        <p className="text-red-600 text-sm mt-1">{errors.tel_client}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationalité
                      </label>
                      <select
                        value={formData.nationalite}
                        onChange={(e) => setFormData({...formData, nationalite: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="Malagasy">Malagasy</option>
                        <option value="Française">Française</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexe
                      </label>
                      <select
                        name="sexe_client"
                        value={formData.sexe_client}
                        onChange={(e) => setFormData({...formData, sexe_client: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <textarea
                      name="adresse_client"
                      value={formData.adresse_client}
                      onChange={(e) => setFormData({...formData, adresse_client: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes spéciales (allergies, besoins particuliers...)
                    </label>
                    <textarea
                      name="notes_speciales"
                      value={formData.notes_speciales}
                      onChange={(e) => setFormData({...formData, notes_speciales: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                      placeholder="Informations supplémentaires..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.reservation}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
                >
                  {loading.reservation ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        Confirmer la réservation
                        {loading.facture && (
                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        )}
                      </span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  En cliquant sur "Confirmer", vous recevrez votre facture par SMS
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReservationPage;