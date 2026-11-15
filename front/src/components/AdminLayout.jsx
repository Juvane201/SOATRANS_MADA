import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Home, Users, Settings, 
  LogOut, Newspaper, Car, Calendar, DollarSign, 
  Plus, Edit, Trash2,
  BarChart3, CreditCard,
  ChevronRight, CheckCircle,
  XCircle, Clock, MapPin, Upload, 
  Sparkles, Loader2, CalendarDays, Ticket, 
  ArrowRight, FilterX, 
  Languages, Phone, Mail, Receipt
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [voitures, setVoitures] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVoiture, setCurrentVoiture] = useState(null);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState({ main: false, table: false });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    villeDepart: '',
    villeArrivee: '',
    dateVoyage: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [selectedVoiturePrice, setSelectedVoiturePrice] = useState(0);
  const [selectedVoiturePlaces, setSelectedVoiturePlaces] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('adminLanguage') || 'fr';
  });

  const translations = {
    fr: {
      dashboard: 'Tableau de bord',
      reservationsList: 'Réservations',
      carManagement: 'Gestion de la flotte',
      clientsManagement: 'Clients',
      newsManagement: 'Actualités',
      billing: 'Factures',
      analytics: 'Analytics',
      searchPlaceholder: 'Rechercher...',
      logout: 'Déconnexion',
      fleetManagement: 'Gestion de la flotte',
      newCar: 'Nouvelle voiture',
      searchCar: 'Rechercher une voiture...',
      departureCity: 'Ville de départ',
      arrivalCity: 'Ville d\'arrivée',
      allStatus: 'Tous les statuts',
      available: 'Disponible',
      unavailable: 'Indisponible',
      reset: 'Réinitialiser',
      edit: 'Modifier',
      delete: 'Supprimer',
      noCarsFound: 'Aucune voiture trouvée',
      noCarsMatch: 'Aucune voiture ne correspond à votre recherche',
      resetFilters: 'Réinitialiser les filtres',
      reservations: 'Réservations',
      totalReservations: 'réservations',
      newReservation: 'Nouvelle réservation',
      searchReservation: 'Rechercher une réservation...',
      reference: 'Référence',
      client: 'Client',
      vehicle: 'Voiture',
      travelDateCol: 'Date voyage',
      seats: 'Places',
      amount: 'Montant',
      status: 'Statut',
      actions: 'Actions',
      confirmed: 'Confirmée',
      pending: 'En attente',
      cancelled: 'Annulée',
      noReservationsFound: 'Aucune réservation trouvée',
      clientsList: 'Clients',
      registeredClients: 'clients enregistrés',
      noClients: 'Aucun client',
      viewDetails: 'Voir détails',
      sectionDevelopment: 'Section en développement',
      comingSoon: 'Cette fonctionnalité est actuellement en cours de développement.',
      backToDashboard: 'Retour au tableau de bord',
      maxSecurity: 'Sécurité maximale',
      secureSystem: 'Système sécurisé',
      todayReservations: 'Réservations du jour',
      todayRevenue: 'Revenus du jour',
      cars: 'Voitures',
      activeClients: 'Clients actifs',
      nextDeparture: 'Prochain départ',
      latestReservations: 'Dernières réservations',
      viewAll: 'Tout voir',
      autoFilled: 'Le tarif est automatiquement rempli',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone',
      gender: 'Sexe',
      male: 'Masculin',
      female: 'Féminin',
      travelDate: 'Date de voyage',
      numberOfSeats: 'Nombre de places',
      totalAmount: 'Montant total',
      selectVehicle: 'Sélectionner une voiture',
      invoiceList: 'Liste des Factures',
      invoiceNum: 'N° Facture',
      dateFacture: 'Date',
      noInvoices: 'Aucune facture trouvée'
    },
    en: {
      dashboard: 'Dashboard',
      reservationsList: 'Reservations',
      carManagement: 'Fleet management',
      clientsManagement: 'Clients',
      newsManagement: 'News',
      billing: 'Invoices',
      analytics: 'Analytics',
      searchPlaceholder: 'Search...',
      logout: 'Logout',
      fleetManagement: 'Fleet management',
      newCar: 'New car',
      searchCar: 'Search for a car...',
      departureCity: 'Departure city',
      arrivalCity: 'Arrival city',
      allStatus: 'All statuses',
      available: 'Available',
      unavailable: 'Unavailable',
      reset: 'Reset',
      edit: 'Edit',
      delete: 'Delete',
      noCarsFound: 'No cars found',
      noCarsMatch: 'No cars match your search',
      resetFilters: 'Reset filters',
      reservations: 'Reservations',
      totalReservations: 'reservations',
      newReservation: 'New reservation',
      searchReservation: 'Search for a reservation...',
      reference: 'Reference',
      client: 'Client',
      vehicle: 'Vehicle',
      travelDateCol: 'Travel date',
      seats: 'Seats',
      amount: 'Amount',
      status: 'Status',
      actions: 'Actions',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      noReservationsFound: 'No reservations found',
      clientsList: 'Clients',
      registeredClients: 'registered clients',
      noClients: 'No clients',
      viewDetails: 'View details',
      sectionDevelopment: 'Section under development',
      comingSoon: 'This feature is currently under development.',
      backToDashboard: 'Back to dashboard',
      maxSecurity: 'Maximum security',
      secureSystem: 'Secure system',
      todayReservations: 'Today\'s reservations',
      todayRevenue: 'Today\'s revenue',
      cars: 'Cars',
      activeClients: 'Active clients',
      nextDeparture: 'Next departure',
      latestReservations: 'Latest reservations',
      viewAll: 'View all',
      autoFilled: 'Price is automatically filled',
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      travelDate: 'Travel date',
      numberOfSeats: 'Number of seats',
      totalAmount: 'Total amount',
      selectVehicle: 'Select vehicle',
      invoiceList: 'Invoices List',
      invoiceNum: 'Invoice #',
      dateFacture: 'Date',
      noInvoices: 'No invoices found'
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    localStorage.setItem('adminLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const normalizeData = useCallback((data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, []);

  const apiConfig = useMemo(() => ({
    baseURL: '', 
    timeout: 90000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }), []);

  const api = useMemo(() => {
    const instance = axios.create(apiConfig);
    
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [apiConfig, navigate]);

  const menuItems = useMemo(() => [
    { id: 'accueil', label: t('dashboard'), icon: Home, color: 'from-blue-500 to-cyan-500', animation: 'animate-pulse' },
    { id: 'reservation', label: t('reservationsList'), icon: Calendar, color: 'from-emerald-500 to-teal-500', animation: 'animate-bounce' },
    { id: 'voiture', label: t('carManagement'), icon: Car, color: 'from-blue-600 to-indigo-600', animation: 'animate-pulse' },
    { id: 'client', label: t('clientsManagement'), icon: Users, color: 'from-orange-500 to-amber-500', animation: 'animate-bounce' },
    { id: 'facture', label: t('billing'), icon: CreditCard, color: 'from-indigo-500 to-blue-500', animation: 'animate-bounce' },
  ], [language]);

  const formatPrice = (price) => {
    if (!price) return '0 Ar';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('MGA', 'Ar');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedImageName('');
  };

  const resetImageStates = () => {
    setPreviewImage(null);
    setSelectedImageName('');
  };

  const handleVoitureChange = (e) => {
    const voitureId = parseInt(e.target.value);
    const voituresArray = normalizeData(voitures);
    const selectedVoiture = voituresArray.find(v => v.id === voitureId);
    
    if (selectedVoiture) {
      setSelectedVoiturePrice(selectedVoiture.frais || 0);
      setSelectedVoiturePlaces(selectedVoiture.nombre_places || 0);
    } else {
      setSelectedVoiturePrice(0);
      setSelectedVoiturePlaces(0);
    }
  };

  const fetchData = useCallback(async (resource) => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      
      const endpoints = {
        'voitures': '/api/voitures',
        'reservations': '/api/reservations',
        'clients': '/api/clients',
        'actualites': '/api/actualites',
        'factures': '/api/factures'
      };
      
      const endpoint = endpoints[resource] || `/api/${resource}`;
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(endpoint, {
        timeout: 70000,
        headers
      });
      
      return normalizeData(response.data);
      
    } catch (error) {
      console.error(`Erreur fetch ${resource}:`, error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
        return [];
      }
      
      return getMockData(resource);
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  }, [navigate, normalizeData]);

  const getMockData = useCallback((resource) => {
    const today = new Date().toISOString().split('T')[0];
    
    const mockData = {
      voitures: [],
      reservations: [],
      clients: [],
      actualites: [],
      factures: []
    };
    
    return mockData[resource] || [];
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      setLoading(prev => ({ ...prev, main: true }));
      
      try {
        const [voituresData, reservationsData, clientsData, facturesData] = await Promise.all([
          fetchData('voitures'),
          fetchData('reservations'),
          fetchData('clients'),
          fetchData('factures')
        ]);
        
        setVoitures(voituresData);
        setReservations(reservationsData);
        setClients(clientsData);
        setFactures(facturesData);
      } catch (error) {
        console.error('Erreur chargement:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(prev => ({ ...prev, main: false }));
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (location.pathname === '/actualites') {
      setActiveTab('actualite');
    }
  }, []);

  const villesDepart = useMemo(() => {
    const voituresArray = normalizeData(voitures);
    return [...new Set(voituresArray.map(v => v.ville_depart).filter(Boolean))];
  }, [voitures, normalizeData]);

  const villesArrivee = useMemo(() => {
    const voituresArray = normalizeData(voitures);
    return [...new Set(voituresArray.map(v => v.destination).filter(Boolean))];
  }, [voitures, normalizeData]);

  const filteredData = useMemo(() => {
    const voituresArray = normalizeData(voitures);
    const reservationsArray = normalizeData(reservations);
    const clientsArray = normalizeData(clients);
    
    let data = [];
    switch (activeTab) {
      case 'voiture':
        data = voituresArray.filter(v => {
          const matchesSearch = searchQuery === '' || 
            v.numero_voiture?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.ville_depart?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.destination?.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesVilleDepart = filters.villeDepart === '' || v.ville_depart === filters.villeDepart;
          const matchesVilleArrivee = filters.villeArrivee === '' || v.destination === filters.villeArrivee;
          
          return matchesSearch && matchesVilleDepart && matchesVilleArrivee;
        });
        break;
      case 'reservation':
        data = reservationsArray.filter(r => {
          const matchesSearch = searchQuery === '' || 
            r.nom_client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.prenom_client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.reference?.toLowerCase().includes(searchQuery.toLowerCase());
          
          return matchesSearch;
        });
        break;
      case 'client':
        data = clientsArray.filter(c => 
          c.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.cin?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      default:
        data = [];
    }
    
    return data;
  }, [activeTab, searchQuery, voitures, reservations, clients, filters, normalizeData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      villeDepart: '',
      villeArrivee: '',
      dateVoyage: ''
    });
  };

  const handleVoitureSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      setLoading(prev => ({ ...prev, main: true }));
      setError(null);

      const endpoint = currentVoiture 
        ? `/api/voitures/${currentVoiture.id}`
        : '/api/voitures';
      
      const response = await api({
        method: currentVoiture ? 'put' : 'post',
        url: endpoint,
        data: formData,
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const updatedVoiture = response.data.data || response.data;
      setVoitures(prev =>
        currentVoiture
          ? prev.map(v => v.id === currentVoiture.id ? updatedVoiture : v)
          : [...prev, updatedVoiture]
      );

      setIsModalOpen(false);
      setCurrentVoiture(null);
      resetImageStates();
      setSuccessMessage(`Voiture ${currentVoiture ? 'modifiée' : 'ajoutée'} avec succès`);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erreur voiture:', error);
      
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join('\n');
        setError(`Erreur de validation : \n${errorMessages}`);
      } else {
        setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      }
    } finally {
      setLoading(prev => ({ ...prev, main: false }));
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(prev => ({ ...prev, main: true }));
      setError(null);

      const form = e.target;
      const formData = new FormData(form);
      
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      const requiredFields = [
        'voiture_id', 'nom_client', 'prenom_client', 'tel_client', 
        'sexe_client', 'date_voyage', 'nombre_places_reservees', 'frais'
      ];
      
      const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        setError(`Champs manquants : ${missingFields.join(', ')}`);
        setLoading(prev => ({ ...prev, main: false }));
        return;
      }

      data.voiture_id = parseInt(data.voiture_id);
      data.nombre_places_reservees = parseInt(data.nombre_places_reservees) || 1;
      data.frais = parseFloat(data.frais) || 0;

      const endpoint = currentReservation 
        ? `/api/reservations/${currentReservation.id}`
        : '/api/reservations';
      
      const response = await api({
        method: currentReservation ? 'put' : 'post',
        url: endpoint,
        data: data,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const updatedReservation = response.data.data || response.data;
      setReservations(prev =>
        currentReservation
          ? prev.map(r => r.id === currentReservation.id ? updatedReservation : r)
          : [...prev, updatedReservation]
      );

      setIsModalOpen(false);
      setCurrentReservation(null);
      setSelectedVoiturePrice(0);
      setSuccessMessage(`Réservation ${currentReservation ? 'modifiée' : 'ajoutée'} avec succès`);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erreur réservation:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        setError(`Erreur de validation:\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'enregistrement de la réservation');
      }
    } finally {
      setLoading(prev => ({ ...prev, main: false }));
    }
  };

  const handleDelete = async (resource, id) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) return;

    try {
      setLoading(prev => ({ ...prev, table: true }));
      
      const url = `/api/${resource}/${id}`;
      await api.delete(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      switch (resource) {
        case 'voitures':
          setVoitures(prev => prev.filter(v => v.id !== id));
          break;
        case 'reservations':
          setReservations(prev => prev.filter(r => r.id !== id));
          break;
        case 'clients':
          setClients(prev => prev.filter(c => c.id !== id));
          break;
        case 'factures':
          setFactures(prev => prev.filter(f => f.id !== id));
          break;
        default:
          break;
      }

      setSuccessMessage('Élément supprimé avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Erreur de suppression :", error);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const StatCard = ({ title, value, icon: Icon, color, index }) => (
    <div 
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slideUp"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} group hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white group-hover:animate-spin" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen || !modalType) return null;

    if (modalType === 'voiture') {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentVoiture ? 'Modifier la voiture' : 'Nouvelle voiture'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
            </div>
            <form onSubmit={handleVoitureSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Numéro de voiture *</label>
                <input
                  type="text"
                  name="numero_voiture"
                  defaultValue={currentVoiture?.numero_voiture || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nombre de places *</label>
                <input
                  type="number"
                  name="nombre_places"
                  defaultValue={currentVoiture?.nombre_places || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Ville de départ *</label>
                  <input
                    type="text"
                    name="ville_depart"
                    defaultValue={currentVoiture?.ville_depart || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    defaultValue={currentVoiture?.destination || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Frais (Ar) *</label>
                  <input
                    type="number"
                    name="frais"
                    defaultValue={currentVoiture?.frais || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Heure de départ *</label>
                  <input
                    type="time"
                    name="heure_depart"
                    defaultValue={currentVoiture?.heure_depart || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Date de voyage *</label>
                <input
                  type="date"
                  name="date_voyage"
                  defaultValue={currentVoiture?.date_voyage || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cliquez pour uploader une image</p>
                  </label>
                </div>
                {previewImage && (
                  <div className="mt-3 relative inline-block">
                    <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading.main}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                >
                  {loading.main ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {currentVoiture ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    if (modalType === 'reservation') {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
            </div>
            <form onSubmit={handleReservationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('selectVehicle')} *
                </label>
                <select
                  name="voiture_id"
                  onChange={handleVoitureChange}
                  defaultValue={currentReservation?.voiture_id || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">{t('selectVehicle')}</option>
                  {Array.isArray(voitures) && voitures.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.numero_voiture} - {v.ville_depart} → {v.destination} ({v.places_disponibles ?? v.nombre_places} places)
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('lastName')} *
                  </label>
                  <input
                    type="text"
                    name="nom_client"
                    defaultValue={currentReservation?.nom_client || ''}
                    placeholder="Ex: Rakoto"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('firstName')} *
                  </label>
                  <input
                    type="text"
                    name="prenom_client"
                    defaultValue={currentReservation?.prenom_client || ''}
                    placeholder="Ex: Jean"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="tel_client"
                    defaultValue={currentReservation?.tel_client || ''}
                    placeholder="Ex: 0341234567"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('gender')} *
                  </label>
                  <select
                    name="sexe_client"
                    defaultValue={currentReservation?.sexe_client || 'M'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="M">{t('male')}</option>
                    <option value="F">{t('female')}</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('travelDate')} *
                  </label>
                  <input
                    type="date"
                    name="date_voyage"
                    defaultValue={currentReservation?.date_voyage || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t('numberOfSeats')} *
                  </label>
                  <input
                    type="number"
                    name="nombre_places_reservees"
                    min="1"
                    max={selectedVoiturePlaces || 10}
                    defaultValue={currentReservation?.nombre_places_reservees || 1}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('totalAmount')} * ({t('autoFilled')})
                </label>
                <input
                  type="number"
                  name="frais"
                  defaultValue={currentReservation?.frais || selectedVoiturePrice}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                  readOnly
                />
                {selectedVoiturePrice > 0 && (
                  <p className="text-sm text-emerald-600 mt-2 font-medium">
                    Prix unitaire: {formatPrice(selectedVoiturePrice)}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading.main}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                >
                  {loading.main ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {currentReservation ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (loading.main && activeTab === 'accueil') {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <Car className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-blue-600 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg animate-pulse">Chargement...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'accueil': {
        const reservationsArray = normalizeData(reservations);
        const voituresArray = normalizeData(voitures);
        const clientsArray = normalizeData(clients);
        const facturesArray = normalizeData(factures);
        
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = reservationsArray.filter(r => r.date_voyage === today);
        const revenueToday = todayReservations.reduce((sum, r) => sum + (parseFloat(r.frais) || 0), 0);
        
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title={t('todayReservations')} value={todayReservations.length} icon={Calendar} color="from-blue-500 to-cyan-500" index={0} />
              <StatCard title={t('todayRevenue')} value={formatPrice(revenueToday)} icon={DollarSign} color="from-green-500 to-emerald-500" index={1} />
              <StatCard title={t('cars')} value={voituresArray.length} icon={Car} color="from-blue-600 to-indigo-600" index={2} />
              <StatCard title={t('activeClients')} value={clientsArray.length} icon={Users} color="from-orange-500 to-amber-500" index={3} />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t('latestReservations')}</h3>
                <button 
                  onClick={() => {
                    setActiveTab('reservation');
                    navigate('/admin', { replace: true });
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                >
                  {t('viewAll')} 
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              {reservationsArray.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune réservation</p>
              ) : (
                <div className="space-y-3">
                  {reservationsArray.slice(0, 5).map((r, idx) => (
                    <div 
                      key={r.id} 
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all hover:scale-[1.02] animate-slideUp"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{r.nom_client} {r.prenom_client}</p>
                        <p className="text-sm text-gray-500">{r.ville_depart} → {r.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{formatPrice(r.frais)}</p>
                        <p className="text-sm text-gray-500">{formatDate(r.date_voyage)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'voiture': {
        const data = filteredData;
        
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('fleetManagement')}</h1>
                <p className="text-gray-600 mt-1">{data.length} voitures trouvées</p>
              </div>
              <button
                onClick={() => {
                  setCurrentVoiture(null);
                  setModalType('voiture');
                  setIsModalOpen(true);
                  resetImageStates();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t('newCar')}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('searchCar')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <select
                  value={filters.villeDepart}
                  onChange={(e) => setFilters(prev => ({ ...prev, villeDepart: e.target.value }))}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">{t('departureCity')}</option>
                  {villesDepart.map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                <select
                  value={filters.villeArrivee}
                  onChange={(e) => setFilters(prev => ({ ...prev, villeArrivee: e.target.value }))}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">{t('arrivalCity')}</option>
                  {villesArrivee.map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all hover:scale-105"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  {t('reset')}
                </button>
              </div>
            </div>

            {loading.table ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 animate-fadeIn">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noCarsFound')}</h3>
                <p className="text-gray-500 mb-6">{t('noCarsMatch')}</p>
                <button onClick={resetFilters} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                  {t('resetFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((voiture, idx) => (
                  <div 
                    key={voiture.id} 
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group animate-slideUp"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                      {voiture.image_url ? (
                        <img 
                          src={voiture.image_url} 
                          alt={voiture.numero_voiture} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-14 w-14 text-blue-300 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          (voiture.places_disponibles ?? voiture.nombre_places) > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(voiture.places_disponibles ?? voiture.nombre_places) > 0 ? t('available') : t('unavailable')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{voiture.numero_voiture}</h3>
                        <span className="text-lg font-bold text-blue-600">{formatPrice(voiture.frais)}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{voiture.ville_depart} → {voiture.destination}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{formatDate(voiture.date_voyage)} • {voiture.heure_depart}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{voiture.places_disponibles ?? voiture.nombre_places} / {voiture.nombre_places} places</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setCurrentVoiture(voiture);
                            setModalType('voiture');
                            setIsModalOpen(true);
                            if (voiture.image_url) setPreviewImage(voiture.image_url);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 flex items-center justify-center text-sm font-medium transition-all hover:scale-105"
                        >
                          <Edit className="h-4 w-4 mr-1.5" />
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete('voitures', voiture.id)}
                          className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 flex items-center justify-center text-sm font-medium transition-all hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'reservation': {
        const data = filteredData;
        
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('reservations')}</h1>
                <p className="text-gray-600 mt-1">{data.length} {t('totalReservations')}</p>
              </div>
              <button
                onClick={() => {
                  setCurrentReservation(null);
                  setModalType('reservation');
                  setIsModalOpen(true);
                  setSelectedVoiturePrice(0);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t('newReservation')}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchReservation')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-slideUp">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('reference')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('client')}</th>
                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('vehicle')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('travelDateCol')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('amount')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('status')}</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-16 text-center text-gray-500">
                          {t('noReservationsFound')}
                        </td>
                      </tr>
                    ) : (
                      data.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <td className="px-6 py-4 font-medium text-gray-900">{r.reference || r.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{r.nom_client} {r.prenom_client}</div>
                            <div className="text-sm text-gray-500">{r.tel_client}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-900">{r.voiture?.numero_voiture || r.voiture_id || '-'}</td>
                          <td className="px-6 py-4 text-gray-900">{formatDate(r.date_voyage)}</td>
                          <td className="px-6 py-4 font-semibold text-emerald-600">{formatPrice(r.frais)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              r.statut === 'confirmée' ? 'bg-green-100 text-green-800' :
                              r.statut === 'annulée' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {r.statut === 'confirmée' ? t('confirmed') : 
                               r.statut === 'annulée' ? t('cancelled') : t('pending')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleDelete('reservations', r.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'client': {
        const data = filteredData;
        
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('clientsList')}</h1>
              <p className="text-gray-600 mt-1">{data.length} {t('registeredClients')}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {data.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 animate-fadeIn">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">{t('noClients')}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((client, idx) => (
                  <div 
                    key={client.id} 
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slideUp"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                        {(client.prenom?.[0] || '') + (client.nom?.[0] || '')}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{client.prenom} {client.nom}</h3>
                        <p className="text-sm text-gray-500">{client.cin || 'Pas de CIN'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-orange-500" />
                        <span>{client.email || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-orange-500" />
                        <span>{client.contact || 'Non spécifié'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-600">
                        {client.reservations_count || 0} réservations
                      </span>
                      <button 
                        onClick={() => handleDelete('clients', client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'facture': {
        const data = normalizeData(factures);

        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('invoiceList')}</h1>
              <p className="text-gray-600 mt-1">{data.length} factures trouvées</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-slideUp">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('invoiceNum')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('client')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('dateFacture')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{t('amount')}</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                          {t('noInvoices')}
                        </td>
                      </tr>
                    ) : (
                      data.map((f, idx) => (
                        <tr key={f.id} className="hover:bg-gray-50 transition-colors animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <td className="px-6 py-4 font-medium text-gray-900">FACT-{f.id.toString().padStart(4, '0')}</td>
                          <td className="px-6 py-4 text-gray-900">{f.client?.nom || 'Inconnu'} {f.client?.prenom || ''}</td>
                          <td className="px-6 py-4 text-gray-900">{formatDate(f.created_at)}</td>
                          <td className="px-6 py-4 font-semibold text-emerald-600">{formatPrice(f.frais)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete('factures', f.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 animate-pulse">
              <Settings className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('sectionDevelopment')}</h3>
            <p className="text-gray-600 text-lg max-w-lg mx-auto mb-8">
              {t('comingSoon')}
            </p>
            <button
              onClick={() => {
                setActiveTab('accueil');
                navigate('/admin', { replace: true });
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-xl transition-all hover:scale-105"
            >
              {t('backToDashboard')}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      <div className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-50 animate-slideInLeft">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => {
              setActiveTab('accueil');
              navigate('/admin', { replace: true });
            }}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Car className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  SOATRANS
                </h1>
                <p className="text-xs text-gray-500">Administration</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab(item.id);
                    navigate('/admin', { replace: true });
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all duration-500 group ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-[1.02]`
                      : 'text-gray-600 hover:bg-gray-100/80 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white animate-spin' : 'text-gray-400 group-hover:text-blue-500'}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto animate-pulse" />}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-gray-200/50">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between px-3 py-2 mb-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4 text-blue-600 group-hover:animate-spin" />
                <span className="text-xs font-semibold text-gray-700">
                  {language === 'fr' ? 'Français' : 'English'}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {language === 'fr' ? 'FR' : 'EN'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 group"
            >
              <LogOut className="h-4 w-4 group-hover:text-red-500 transition-colors" />
              <span className="font-semibold text-sm">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="ml-64 transition-all duration-500">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300/50 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 backdrop-blur-sm transition-all duration-300 group-hover:border-blue-300 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {successMessage && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 animate-slideUp">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-bold text-sm">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 hover:text-green-800 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {children || renderContent()}
        </main>
      </div>

      {isModalOpen && renderModal()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminLayout;