import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ShoppingBag, Phone, Mail, MapPin, 
  User, Menu, X, Search, Play, Car, ArrowRight, Star, Clock,
  CheckCircle, Calendar, Users, Filter, Shield, Database, Newspaper, Headphones,
  TrendingUp, Award, Navigation, CreditCard, Globe, Zap,
  Loader2, Send, Building, Wifi, Battery, Cloud, Server,
  Heart, Sparkles, Target, Globe as GlobeIcon,
  Train, Plane, Bus, Package, Luggage, Wallet,
  ChevronDown, ChevronUp, Map, Ticket, ShieldCheck, Languages
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('welcome');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    voitures: false,
    actualites: false,
    reservation: false,
    contact: false
  });
  const [voitures, setVoitures] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [filteredVoitures, setFilteredVoitures] = useState([]);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const [language, setLanguage] = useState('fr');

  const translations = {
    fr: {
      title: 'BIENVENUE',
      subtitle: 'Découvrez Madagascar en toute sérénité avec notre service de transport premium. Confort, sécurité et authenticité garantis.',
      searchTitle: 'Trouvez votre voyage idéal',
      searchSubtitle: 'Sélectionnez votre trajet pour découvrir les voitures disponibles',
      depart: 'Départ de...',
      destination: 'Destination...',
      date: 'jj/mm/aaaa',
      search: 'RECHERCHER',
      searching: 'RECHERCHE...',
      vehicles: 'Véhicules',
      destinations: 'Destinations',
      searchTrip: 'CHERCHER UN VOYAGE',
      ourNews: 'NOS ACTUALITÉS',
      services: 'NOS AVANTAGES EXCLUSIFS',
      why: 'Pourquoi',
      soatrans: 'SOATRANS',
      experience: 'Une expérience de voyage exceptionnelle à chaque trajet',
      totalSecurity: 'Sécurité Totale',
      securityDesc: 'Conducteurs certifiés et véhicules entretenus',
      punctuality: 'Ponctualité',
      punctualityDesc: 'Respect strict des horaires de départ',
      support: 'Support 24/7',
      supportDesc: 'Assistance disponible jour et nuit',
      payment: 'Paiement Sécurisé',
      paymentDesc: 'Transactions cryptées et garanties',
      availableTrips: 'VOYAGES DISPONIBLES',
      searchYourTrip: 'Recherchez votre voyage',
      trips: 'Des trajets confortables à travers Madagascar',
      startSearch: 'Commencez votre recherche',
      startSearchDesc: 'Sélectionnez votre ville de départ et destination pour découvrir les voitures disponibles',
      searchTripBtn: 'RECHERCHER UN VOYAGE',
      example: 'VOIR UN EXEMPLE',
      step1: '1. Choisissez votre trajet',
      step1Desc: 'Sélectionnez départ et destination',
      step2: '2. (Optionnel) Date',
      step2Desc: 'Choisissez une date spécifique si besoin',
      step3: '3. Réservez votre place',
      step3Desc: 'Choisissez votre voiture et réservez',
      noResults: 'Aucun trajet disponible',
      noResultsDesc: 'Essayez une autre destination ou une autre date',
      newSearch: 'NOUVELLE RECHERCHE',
      news: 'ACTUALITÉS & INNOVATIONS',
      ourNewsTitle: 'Nos dernières nouvelles',
      stayInformed: 'Restez informé de nos innovations',
      contact: 'CONTACTEZ-NOUS',
      contactTitle: 'Nous contacter',
      contactSubtitle: 'Notre équipe est à votre disposition',
      sendMessage: 'Envoyez-nous un message',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      send: 'ENVOYER LE MESSAGE',
      sending: 'Envoi en cours...',
      phone: 'Téléphone',
      hours: 'Horaires',
      quickLinks: 'Liens rapides',
      home: 'Accueil',
      actualites: 'Actualités',
      searchVehicle: 'Rechercher un voyage',
      contactUs: 'Contact',
      myAccount: 'Mon Compte',
      legal: 'Informations',
      terms: 'Conditions générales',
      privacy: 'Politique de confidentialité',
      legalMentions: 'Mentions légales',
      faq: 'FAQ',
      help: 'Aide',
      newsletter: 'Newsletter',
      newsletterDesc: 'Restez informé de nos offres spéciales',
      subscribe: 'OK',
      rights: 'Tous droits réservés',
      secure: 'Site sécurisé',
      online: 'En ligne 24/7',
      login: 'Connexion',
      available: 'DISPONIBLE',
      full: 'COMPLET',
      perSeat: 'par place',
      total: 'Total pour',
      seats: 'place(s)',
      book: 'RÉSERVER',
      fewSeats: 'Peu de places !',
      ourCoverage: 'Notre couverture nationale',
      coverageDesc: 'Nous couvrons toutes les régions de Madagascar',
      contactInfo: 'Informations rapides',
      travel: 'Trajet',
      departureTime: 'Heure de départ',
      availableSeats: 'Places disponibles',
      flexibleDates: 'Dates flexibles',
      seeDate: 'Voir cette date'
    },
    en: {
      title: 'WELCOME',
      subtitle: 'Discover Madagascar with serenity through our premium transport service. Comfort, safety and authenticity guaranteed.',
      searchTitle: 'Find your ideal trip',
      searchSubtitle: 'Select your route to discover available vehicles',
      depart: 'Depart from...',
      destination: 'Destination...',
      date: 'dd/mm/yyyy',
      search: 'SEARCH',
      searching: 'SEARCHING...',
      vehicles: 'Vehicles',
      destinations: 'Destinations',
      searchTrip: 'SEARCH FOR A TRIP',
      ourNews: 'OUR NEWS',
      services: 'OUR EXCLUSIVE ADVANTAGES',
      why: 'Why',
      soatrans: 'SOATRANS',
      experience: 'An exceptional travel experience on every journey',
      totalSecurity: 'Total Security',
      securityDesc: 'Certified drivers and maintained vehicles',
      punctuality: 'Punctuality',
      punctualityDesc: 'Strict adherence to departure times',
      support: '24/7 Support',
      supportDesc: 'Assistance available day and night',
      payment: 'Secure Payment',
      paymentDesc: 'Encrypted and guaranteed transactions',
      availableTrips: 'AVAILABLE TRIPS',
      searchYourTrip: 'Search for your trip',
      trips: 'Comfortable trips across Madagascar',
      startSearch: 'Start your search',
      startSearchDesc: 'Select your departure city and destination to discover available vehicles',
      searchTripBtn: 'SEARCH FOR A TRIP',
      example: 'VIEW AN EXAMPLE',
      step1: '1. Choose your route',
      step1Desc: 'Select departure and destination',
      step2: '2. (Optional) Date',
      step2Desc: 'Choose a specific date if needed',
      step3: '3. Book your seat',
      step3Desc: 'Choose your vehicle and book',
      noResults: 'No trips available',
      noResultsDesc: 'Try another destination or date',
      newSearch: 'NEW SEARCH',
      news: 'NEWS & INNOVATIONS',
      ourNewsTitle: 'Our latest news',
      stayInformed: 'Stay informed about our innovations',
      contact: 'CONTACT US',
      contactTitle: 'Contact us',
      contactSubtitle: 'Our team is at your disposal',
      sendMessage: 'Send us a message',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'SEND MESSAGE',
      sending: 'Sending...',
      phone: 'Phone',
      hours: 'Opening Hours',
      quickLinks: 'Quick Links',
      home: 'Home',
      actualites: 'News',
      searchVehicle: 'Search for a trip',
      contactUs: 'Contact',
      myAccount: 'My Account',
      legal: 'Information',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
      legalMentions: 'Legal Mentions',
      faq: 'FAQ',
      help: 'Help',
      newsletter: 'Newsletter',
      newsletterDesc: 'Stay informed about our special offers',
      subscribe: 'OK',
      rights: 'All rights reserved',
      secure: 'Secure site',
      online: 'Online 24/7',
      login: 'Login',
      available: 'AVAILABLE',
      full: 'FULL',
      perSeat: 'per seat',
      total: 'Total for',
      seats: 'seat(s)',
      book: 'BOOK',
      fewSeats: 'Few seats left!',
      ourCoverage: 'Our national coverage',
      coverageDesc: 'We cover all regions of Madagascar',
      contactInfo: 'Quick Information',
      travel: 'Route',
      departureTime: 'Departure time',
      availableSeats: 'Available seats',
      flexibleDates: 'Flexible dates',
      seeDate: 'See this date'
    }
  };

  const [filters, setFilters] = useState({
    ville_depart: '',
    destination: '',
    date_voyage: '',
    nombre_places: 1
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const apiConfig = {
    baseURL: '/api', 
    timeout: 90000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const api = axios.create(apiConfig);

  useEffect(() => {
    const fetchData = async () => {
      if (showWelcome) return;

      try {
        setLoading(prev => ({ ...prev, actualites: true }));
        
        const actualitesResponse = await api.get('/actualites');
        const actualitesData = actualitesResponse.data.data || [];
        setActualites(actualitesData);
        
        await fetchAvailableCities();
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setActualites(defaultActualites);
      } finally {
        setLoading(prev => ({ ...prev, actualites: false }));
      }
    };

    fetchData();
  }, [showWelcome]);

  const fetchAvailableCities = async () => {
    try {
      let voituresData = [];
      try {
        const response = await api.get('/voitures');
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          voituresData = response.data.data;
        }
      } catch (error) {
        console.error('❌ Erreur avec /voitures:', error.message);
      }
      
      if (voituresData.length === 0) {
        const defaultCities = [
          'Antananarivo', 'Mahajanga', 'Toamasina', 'Manakara',
          'Antsirabe', 'Fianarantsoa', 'Toliara',
          'Majunga', 'Tamatave', 'Diego Suarez'
        ];
        setUniqueCities(defaultCities);
        setAvailableDestinations(defaultCities);
        return;
      }
      
      const departCities = [];
      const destCities = [];
      
      voituresData.forEach(item => {
        if (item && typeof item === 'object') {
          if (item.ville_depart && typeof item.ville_depart === 'string' && item.ville_depart.trim()) {
            const city = item.ville_depart.trim();
            if (city && !departCities.includes(city)) departCities.push(city);
          }
          if (item.destination && typeof item.destination === 'string' && item.destination.trim()) {
            const city = item.destination.trim();
            if (city && !destCities.includes(city)) destCities.push(city);
          }
        }
      });
      
      const uniqueDepartCities = departCities.length > 0 ? departCities : ['Antananarivo', 'Mahajanga', 'Toamasina', 'Antsirabe'];
      const uniqueDestCities = destCities.length > 0 ? destCities : ['Mahajanga', 'Toamasina', 'Antsirabe', 'Fianarantsoa'];
      
      setUniqueCities(uniqueDepartCities);
      setAvailableDestinations(uniqueDestCities);
      
    } catch (error) {
      const defaultCities = ['Antananarivo', 'Mahajanga', 'Toamasina', 'Antsirabe'];
      setUniqueCities(defaultCities);
      setAvailableDestinations(defaultCities);
    }
  };

  const defaultActualites = [
    {
      id: 1,
      titre: "Nouvelle flotte de véhicules électriques",
      contenu: "SOATRANS s'engage pour l'environnement avec une nouvelle gamme de véhicules électriques pour vos déplacements urbains.",
      date_publication: "2024-12-01",
      image_url: "https://images.unsplash.com/photo-1593941707882-5bac6861d75?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      titre: "Service VIP disponible",
      contenu: "Découvrez notre nouveau service VIP avec sièges massants et WiFi gratuit.",
      date_publication: "2024-11-15",
      image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
    }
  ];

  const stats = [
    { icon: Car, value: '150+', labelKey: 'vehicles', color: 'from-blue-500 to-cyan-500', animate: 'animate-pulse' },
    { icon: MapPin, value: '25+', labelKey: 'destinations', color: 'from-green-500 to-emerald-500', animate: 'animate-bounce' }
  ];

  const services = [
    {
      icon: ShieldCheck,
      titleKey: 'totalSecurity',
      descriptionKey: 'securityDesc',
      color: 'text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100',
      gradient: 'from-blue-500 to-blue-700',
      animation: 'hover:animate-pulse'
    },
    {
      icon: Clock,
      titleKey: 'punctuality',
      descriptionKey: 'punctualityDesc',
      color: 'text-green-600 bg-gradient-to-br from-green-50 to-green-100',
      gradient: 'from-green-500 to-green-700',
      animation: 'hover:animate-bounce'
    },
    {
      icon: Headphones,
      titleKey: 'support',
      descriptionKey: 'supportDesc',
      color: 'text-amber-600 bg-gradient-to-br from-amber-50 to-amber-100',
      gradient: 'from-amber-500 to-amber-700',
      animation: 'hover:animate-spin'
    },
    {
      icon: CreditCard,
      titleKey: 'payment',
      descriptionKey: 'paymentDesc',
      color: 'text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100',
      gradient: 'from-indigo-500 to-indigo-700',
      animation: 'hover:animate-ping'
    }
  ];

  useEffect(() => {
    if (actualites.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % actualites.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [actualites]);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setActiveSection('home');
    }, 3500);
    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    if (showWelcome) return;

    const handleScroll = () => {
      const sections = ['home', 'actualites', 'voitures', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showWelcome]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % actualites.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + actualites.length) % actualites.length);
  };

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const handleSearch = async () => {
    if (!filters.ville_depart || !filters.destination) {
      alert(t('Please select a departure city and destination'));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, voitures: true }));
      
      const params = new URLSearchParams();
      params.append('ville_depart', filters.ville_depart);
      params.append('destination', filters.destination);
      
      if (filters.date_voyage) {
        params.append('date_voyage', filters.date_voyage);
      }
      
      const response = await api.get(`/voitures/search?${params.toString()}`);
      
      let voituresData = [];
      
      if (response.data && response.data.success === true) {
        const responseData = response.data.data;
        
        if (Array.isArray(responseData)) {
          voituresData = responseData.filter(voiture => 
            voiture && typeof voiture === 'object' && voiture !== null &&
            (voiture.id || voiture.numero_voiture || voiture.ville_depart)
          );
        }
        else if (responseData && typeof responseData === 'object') {
          if (Array.isArray(responseData.data)) {
            voituresData = responseData.data.filter(v => v && typeof v === 'object');
          }
          else if (Array.isArray(responseData.items)) {
            voituresData = responseData.items.filter(v => v && typeof v === 'object');
          }
          else {
            try {
              const values = Object.values(responseData);
              voituresData = values.filter(item => 
                item && typeof item === 'object' && item !== null &&
                (item.id || item.numero_voiture || item.ville_depart)
              );
            } catch (error) {}
          }
        }
      }
      else if (Array.isArray(response.data)) {
        voituresData = response.data.filter(voiture => voiture && typeof voiture === 'object');
      }
      else if (response.data && typeof response.data === 'object') {
        const possiblePaths = [response.data.data, response.data.items, response.data.voitures, response.data.results, response.data.list, response.data];
        for (const data of possiblePaths) {
          if (Array.isArray(data)) {
            voituresData = data.filter(item => item && typeof item === 'object');
            break;
          }
        }
      }
      
      voituresData = voituresData.map(voiture => {
        return {
          id: voiture.id || voiture.ID || null,
          numero_voiture: voiture.numero_voiture || voiture.numero || voiture.matricule || 'N/A',
          ville_depart: voiture.ville_depart || voiture.depart || filters.ville_depart,
          destination: voiture.destination || voiture.arrivee || filters.destination,
          date_voyage: voiture.date_voyage || voiture.date || filters.date_voyage,
          heure_depart: voiture.heure_depart || voiture.heure || '00:00',
          frais: parseFloat(voiture.frais) || 0,
          nombre_places: parseInt(voiture.nombre_places) || 0,
          places_disponibles: parseInt(voiture.places_disponibles) || parseInt(voiture.nombre_places) || 0,
          image_url: voiture.image_url || voiture.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
          disponible: voiture.disponible !== undefined ? voiture.disponible : true
        };
      }).filter(voiture => voiture.id || voiture.numero_voiture !== 'N/A');
      
      setVoitures(voituresData);
      setFilteredVoitures(voituresData);
      setShowSearchResults(true);
      
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      
    } catch (error) {
      let errorMessage = 'Erreur lors de la recherche des voitures disponibles';
      if (error.response?.data?.message) errorMessage += ': ' + error.response.data.message;
      alert(errorMessage);
      setFilteredVoitures([]);
    } finally {
      setLoading(prev => ({ ...prev, voitures: false }));
    }
  };

  const resetSearch = () => {
    setFilters({ ville_depart: '', destination: '', date_voyage: '', nombre_places: 1 });
    setShowSearchResults(false);
    setVoitures([]);
    setFilteredVoitures([]);
  };

  const handleReserve = (voitureId) => {
    navigate(`/reservation/${voitureId}`);
  };

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  const handleContactSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(prev => ({ ...prev, contact: true }));
    await api.post('/messages', formData);
    alert(t('Message envoyé avec succès !'));
    setFormData({ prenom: '', nom: '', email: '', sujet: '', message: '' });
  } catch (error) {
    alert(t('Erreur lors de l\'envoi du message'));
  } finally {
    setLoading(prev => ({ ...prev, contact: false }));
  }
};

  const Header = () => (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-500 transform ${
        showWelcome ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
              <Car className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                SOATRANS
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {[
                { id: 'home', labelKey: 'home' },
                { id: 'actualites', labelKey: 'actualites' },
                { id: 'voitures', labelKey: 'searchVehicle' },
                { id: 'contact', labelKey: 'contactUs' },
              ].map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className="relative group">
                  <span className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
                  }`}>
                    {t(item.labelKey)}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-300"></span>
                    {activeSection === item.id && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 animate-pulse"></span>
                    )}
                  </span>
                </button>
              ))}
            </nav>

            <button onClick={toggleLanguage} className="relative group flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
              <div className="relative z-10 flex items-center space-x-2">
                <span className="font-semibold text-gray-700">{language === 'fr' ? 'FR' : 'EN'}</span>
                <div className="w-6 h-4 bg-gray-200 rounded-full relative group-hover:bg-blue-200 transition-colors duration-300">
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 ${
                    language === 'en' ? 'translate-x-3 bg-blue-600' : 'translate-x-0.5 bg-teal-500'
                  }`}></div>
                </div>
              </div>
            </button>
            
            <button onClick={handleLoginClick} className="relative group">
              <div className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse">
                <User size={18} className="group-hover:animate-spin" />
                <span className="font-semibold">{t('login')}</span>
              </div>
            </button>
          </div>

          <button className="md:hidden p-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 animate-slideDown">
            <div className="px-4 py-3 space-y-2">
              {[
                { id: 'home', labelKey: 'home' },
                { id: 'actualites', labelKey: 'actualites' },
                { id: 'voitures', labelKey: 'searchVehicle' },
                { id: 'contact', labelKey: 'contactUs' },
              ].map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}>
                  {t(item.labelKey)}
                </button>
              ))}
              
              <button onClick={toggleLanguage} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 transition-all duration-300">
                <span className="flex items-center space-x-2"><Languages size={18} /><span>{t('Language') || 'Langue'}</span></span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg font-bold">{language === 'fr' ? 'FR' : 'EN'}</span>
              </button>
              
              <button onClick={handleLoginClick} className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl w-full mt-2 hover:shadow-lg transition-all duration-300">
                <User size={16} /><span className="font-semibold">{t('login')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  const WelcomeAnimation = () => (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 transition-all duration-1000 ${
      showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="relative mb-12">
        <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <Car className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-blue-400 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <WelcomeAnimation />
      <Header />

      <section id="home" className={`pt-28 min-h-screen relative overflow-hidden transition-all duration-1000 ${showWelcome ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-transparent animate-gradient" />
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=1080&fit=crop" alt="Road trip in Madagascar" className="w-full h-full object-cover transform scale-110 animate-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent" />
          
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full animate-particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }} />
            ))}
          </div>
        </div>

        <div className="relative z-30 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto animate-slideUp">
            
            {/* ====== NOUVEAU TITRE ANIMÉ : VOITURE AVEC CARTE ====== */}
            <div className="relative w-full h-56 mb-8 flex items-center justify-center overflow-hidden">
              <div className="animate-drive absolute flex flex-col items-center">
                
                {/* Carte de titre */}
                <div className="bg-white/95 backdrop-blur-md px-8 py-3 rounded-2xl shadow-2xl border-2 border-blue-500 relative mb-2 transform transition-transform hover:scale-110">
                  <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                    {t('title')}
                  </h1>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-blue-500 rotate-45"></div>
                </div>
                
                {/* Voiture et effets */}
                <div className="relative">
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-16 h-1.5 bg-gradient-to-l from-blue-500/60 to-transparent rounded-full animate-pulse mr-3"></div>
                  <Car className="w-24 h-24 md:w-32 md:h-32 text-blue-600 drop-shadow-2xl" strokeWidth={1.5} />
                  
                  {/* Roues animées */}
                  <div className="absolute bottom-3 left-4 w-7 h-7 bg-gray-800 rounded-full border-4 border-gray-400 animate-spin-slow"></div>
                  <div className="absolute bottom-3 right-4 w-7 h-7 bg-gray-800 rounded-full border-4 border-gray-400 animate-spin-slow"></div>
                </div>

              </div>
            </div>
            {/* ======================================================== */}

            <p className="text-2xl md:text-3xl text-black max-w-3xl mx-auto mb-16 leading-relaxed font-medium drop-shadow-lg animate-fadeIn">
              {t('subtitle')}
            </p>

            <div className="max-w-5xl mx-auto mt-12">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl flex items-center justify-center animate-pulse">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('searchTitle')}</h2>
                  </div>
                  <p className="text-gray-600">{t('searchSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <select value={filters.ville_depart} onChange={(e) => setFilters({...filters, ville_depart: e.target.value})} className="w-full pl-16 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium appearance-none cursor-pointer">
                      <option value="" className="text-gray-500">{t('depart')}</option>
                      {uniqueCities.map((city, index) => (
                        <option key={index} value={city} className="text-gray-900">🚗 {city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <select value={filters.destination} onChange={(e) => setFilters({...filters, destination: e.target.value})} className="w-full pl-16 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium appearance-none cursor-pointer">
                      <option value="" className="text-gray-500">{t('destination')}</option>
                      {availableDestinations.map((city, index) => (
                        <option key={index} value={city} className="text-gray-900">🏁 {city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <input type="date" value={filters.date_voyage} onChange={(e) => setFilters({...filters, date_voyage: e.target.value})} min={new Date().toISOString().split('T')[0]} className="w-full pl-16 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium cursor-pointer" placeholder={t('date')} />
                  </div>

                  <button onClick={handleSearch} disabled={loading.voitures || !filters.ville_depart || !filters.destination} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-2xl">
                    {loading.voitures ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-lg">{t('searching')}</span></>
                    ) : (
                      <><Search className="w-6 h-6 group-hover:animate-bounce" /><span className="text-lg">{t('search')}</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-24 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 transform hover:scale-110 transition-all duration-500 border border-white/30 shadow-2xl hover:shadow-3xl" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg ${stat.animate}`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 animate-bounce">{stat.value}</div>
                  <div className="text-gray-200 text-lg">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-20">
              <button onClick={() => { scrollToSection('voitures'); setFilters({ ville_depart: 'Antananarivo', destination: 'Mahajanga', date_voyage: '', nombre_places: 1 }); }} className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-4">
                  <Search className="w-6 h-6 group-hover:animate-bounce" /><span className="text-lg">{t('searchTrip')}</span><ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button onClick={() => scrollToSection('actualites')} className="group px-12 py-5 border-3 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center space-x-4">
                  <Play className="w-6 h-6 group-hover:animate-pulse" /><span className="text-lg">{t('ourNews')}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button onClick={() => scrollToSection('voitures')} className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 animate-bounce hover:animate-none">
            <ChevronRight className="text-white rotate-90 w-8 h-8" />
          </button>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full mb-6 shadow-lg">
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">{t('services')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('why')} <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent animate-gradientText">{t('soatrans')}</span> ?
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">{t('experience')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-20 h-20 mb-8 rounded-2xl ${service.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg ${service.animation}`}>
                  <service.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(service.titleKey)}</h3>
                <p className="text-gray-600 text-lg">{t(service.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="voitures" className={`py-24 bg-gradient-to-b from-white via-blue-50/30 to-cyan-50/30 transition-all duration-1000 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full mb-6 shadow-lg">
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{t('availableTrips')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {showSearchResults ? (<>Trajets disponibles pour <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{filters.ville_depart} → {filters.destination}</span></>) : (<>{t('searchYourTrip')} <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{t('soatrans')}</span></>)}
            </h2>
            <p className="text-2xl text-gray-600">
              {showSearchResults ? (filters.date_voyage ? `Le ${new Date(filters.date_voyage).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` : 'Toutes les dates disponibles') : t('trips')}
            </p>
          </div>

          {!showSearchResults ? (
            <div id="search-invitation" className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative z-10 w-full h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                    <Search className="w-16 h-16 text-white animate-bounce" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('startSearch')}</h3>
                <p className="text-xl text-gray-600 mb-8">{t('startSearchDesc')}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => { const heroSection = document.getElementById('home'); heroSection.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 group">
                    <Search className="w-5 h-5 group-hover:animate-bounce" /><span>{t('searchTripBtn')}</span>
                  </button>
                  
                  <button onClick={() => { setFilters({ ville_depart: 'Antananarivo', destination: 'Mahajanga', date_voyage: new Date().toISOString().split('T')[0], nombre_places: 1 }); handleSearch(); }} className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center space-x-3">
                    <Car className="w-5 h-5" /><span>{t('example')}</span>
                  </button>
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto"><MapPin className="w-6 h-6 text-white" /></div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('step1')}</h4><p className="text-gray-600">{t('step1Desc')}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 mx-auto"><Calendar className="w-6 h-6 text-white" /></div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('step2')}</h4><p className="text-gray-600">{t('step2Desc')}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto"><Car className="w-6 h-6 text-white" /></div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('step3')}</h4><p className="text-gray-600">{t('step3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : loading.voitures ? (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <Car className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <p className="text-gray-600 mt-6 text-lg animate-pulse">Recherche des voitures disponibles pour {filters.ville_depart} → {filters.destination}...</p>
            </div>
          ) : !Array.isArray(filteredVoitures) || filteredVoitures.length === 0 ? (
            <div id="search-results" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative z-10 w-full h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                    <Car className="w-16 h-16 text-white animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{!Array.isArray(filteredVoitures) ? 'Données invalides' : t('noResults')}</h3>
                <p className="text-gray-600 mb-6">{!Array.isArray(filteredVoitures) ? 'Les données reçues ne sont pas au format attendu.' : filters.date_voyage ? `Aucune voiture disponible pour le trajet ${filters.ville_depart} → ${filters.destination} le ${new Date(filters.date_voyage).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` : `Aucune voiture disponible pour le trajet ${filters.ville_depart} → ${filters.destination}`}</p>
                <p className="text-sm text-gray-500 mb-6">{t('noResultsDesc')}</p>
                <div className="space-y-4">
                  <button onClick={resetSearch} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 mx-auto">
                    <Search className="w-5 h-5" /><span>{t('newSearch')}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div id="search-results" className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{filteredVoitures.length} voiture{filteredVoitures.length > 1 ? 's' : ''} disponible{filteredVoitures.length > 1 ? 's' : ''}</h3>
                    <p className="text-gray-600">{filters.ville_depart} → {filters.destination}{filters.date_voyage && ` • ${new Date(filters.date_voyage).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={resetSearch} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <X className="w-4 h-4" /><span>Modifier la recherche</span>
                    </button>
                  </div>
                </div>
              </div>

              {(function() {
                if (!Array.isArray(filteredVoitures) || filteredVoitures.length === 0) return null;
                const groupedVoitures = filteredVoitures.reduce((groups, voiture) => {
                  if (!voiture || typeof voiture !== 'object') return groups;
                  const date = voiture.date_voyage && typeof voiture.date_voyage === 'string' ? voiture.date_voyage : 'Date non spécifiée';
                  if (!groups[date]) groups[date] = [];
                  if (voiture.id || voiture.numero_voiture) groups[date].push(voiture);
                  return groups;
                }, {});

                const sortedDates = Object.keys(groupedVoitures).sort((a, b) => {
                  if (a === 'Date non spécifiée') return 1;
                  if (b === 'Date non spécifiée') return -1;
                  try { return new Date(a) - new Date(b); } catch (error) { return 0; }
                });

                return sortedDates.map((date, dateIndex) => {
                  const voituresDuJour = groupedVoitures[date];
                  if (!Array.isArray(voituresDuJour) || voituresDuJour.length === 0) return null;

                  return (
                    <div key={date} className="space-y-6">
                      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-white" /></div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{date === 'Date non spécifiée' ? t('flexibleDates') : (() => { try { return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (error) { return date; } })()}</h4>
                            <p className="text-gray-600">{voituresDuJour.length} voiture{voituresDuJour.length > 1 ? 's' : ''} disponible{voituresDuJour.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        {date !== 'Date non spécifiée' && (
                          <button onClick={() => setFilters({...filters, date_voyage: date})} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">{t('seeDate')}</button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {voituresDuJour.map((voiture, index) => {
                          if (!voiture || typeof voiture !== 'object') return null;
                          const placesDisponibles = parseInt(voiture.places_disponibles) || 0;
                          const totalPlaces = parseInt(voiture.nombre_places) || 0;
                          const prixParPlace = parseFloat(voiture.frais) || 0;
                          const prixTotal = prixParPlace * (filters.nombre_places || 1);
                          
                          return (
                            <div key={voiture.id || `${date}-${index}`} className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 animate-slideUp" style={{ animationDelay: `${dateIndex * 0.2 + index * 0.1}s` }}>
                              <div className="relative overflow-hidden h-64">
                                <img src={voiture.image_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'} alt={voiture.numero_voiture || 'Voiture'} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-6 left-6">
                                  <span className={`px-4 py-2 rounded-full text-base font-bold shadow-lg ${placesDisponibles > 0 ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'}`}>{placesDisponibles > 0 ? t('available') : t('full')}</span>
                                </div>
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                  <span className="text-2xl font-bold text-blue-600">Ar{prixParPlace.toLocaleString()}</span>
                                  <span className="text-sm text-gray-500 block">{t('perSeat')}</span>
                                </div>
                              </div>
                              
                              <div className="p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-800">{voiture.numero_voiture || `Voiture ${voiture.id || index + 1}`}</h3>
                                <div className="space-y-4 mb-6">
                                  <div className="flex items-center">
                                    <MapPin size={20} className="mr-3 text-blue-500" />
                                    <div><p className="text-sm text-gray-500">{t('travel')}</p><p className="font-semibold">{voiture.ville_depart || 'Départ'} → {voiture.destination || 'Destination'}</p></div>
                                  </div>
                                  {voiture.heure_depart && (
                                    <div className="flex items-center">
                                      <Clock size={20} className="mr-3 text-teal-500" />
                                      <div><p className="text-sm text-gray-500">{t('departureTime')}</p><p className="font-semibold">{voiture.heure_depart}</p></div>
                                    </div>
                                  )}
                                  <div className="flex items-center">
                                    <Users size={20} className="mr-3 text-amber-500" />
                                    <div>
                                      <p className="text-sm text-gray-500">{t('availableSeats')}</p>
                                      <div className="flex items-center space-x-2">
                                        <p className="font-semibold">{placesDisponibles} / {totalPlaces}</p>
                                        {placesDisponibles <= 3 && placesDisponibles > 0 && (<span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full animate-pulse">{t('fewSeats')}</span>)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm text-gray-500">{t('total')} {filters.nombre_places} {t('seats')}</p>
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Ar{prixTotal.toLocaleString()}</div>
                                  </div>
                                  <button onClick={() => voiture.id && handleReserve(voiture.id)} disabled={placesDisponibles < filters.nombre_places} className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 overflow-hidden">
                                    <span className="relative z-10 flex items-center space-x-3"><ShoppingBag size={20} /><span className="font-bold">{t('book')}</span></span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </section>

      <section id="actualites" className={`py-24 bg-white transition-all duration-1000 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full mb-6 shadow-lg">
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{t('news')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">{t('ourNewsTitle')}</h2>
            <p className="text-2xl text-gray-600">{t('stayInformed')}</p>
          </div>

          {loading.actualites ? (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <Newspaper className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <p className="text-gray-600 mt-6 text-lg animate-pulse">Chargement des actualités...</p>
            </div>
          ) : actualites.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">Aucune actualité disponible.</div>
          ) : (
            <div className="relative max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-all duration-500">
              <div className="relative h-[600px]">
                <img src={actualites[currentSlide]?.image_url || 'https://via.placeholder.com/800x600'} alt={actualites[currentSlide]?.titre} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <Calendar className="w-6 h-6 text-blue-300 animate-pulse" />
                    <span className="text-lg opacity-90">{new Date(actualites[currentSlide]?.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6">{actualites[currentSlide]?.titre}</h3>
                  <p className="text-xl opacity-90 max-w-3xl">{actualites[currentSlide]?.contenu}</p>
                </div>

                <button onClick={prevSlide} className="absolute left-6 top-1/2 transform -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                  <ChevronLeft className="text-white w-8 h-8" />
                </button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                  <ChevronRight className="text-white w-8 h-8" />
                </button>
              </div>

              <div className="flex justify-center space-x-4 p-6 bg-gray-50">
                {actualites.map((_, index) => (
                  <button key={index} onClick={() => setCurrentSlide(index)} className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${index === currentSlide ? 'bg-gradient-to-r from-blue-600 to-teal-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className={`py-24 bg-gradient-to-b from-white to-blue-50 transition-all duration-1000 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full mb-6 shadow-lg">
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{t('contact')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">{t('contactTitle')}</h2>
            <p className="text-2xl text-gray-600">{t('contactSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div className="bg-gradient-to-br from-white to-teal-50 p-10 rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-105 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-10 text-gray-800">{t('sendMessage')}</h3>
              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <div className="block text-base font-medium text-gray-700 mb-3">{t('firstName')}</div>
                    <input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300" placeholder={t('firstName')} required />
                  </div>
                  <div className="group">
                    <div className="block text-base font-medium text-gray-700 mb-3">{t('lastName')}</div>
                    <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300" placeholder={t('lastName')} required />
                  </div>
                </div>
                
                <div className="group">
                  <div className="block text-base font-medium text-gray-700 mb-3">{t('email')}</div>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300" placeholder="votre@email.com" required />
                </div>
                
                <div className="group">
                  <div className="block text-base font-medium text-gray-700 mb-3">{t('subject')}</div>
                  <input type="text" value={formData.sujet} onChange={(e) => setFormData({...formData, sujet: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300" placeholder={t('subject')} required />
                </div>
                
                <div className="group">
                  <div className="block text-base font-medium text-gray-700 mb-3">{t('message')}</div>
                  <textarea rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300 resize-none" placeholder={t('message')} required />
                </div>
                
                <button type="submit" disabled={loading.contact} className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group">
                  {loading.contact ? (<><Loader2 className="w-6 h-6 animate-spin" /><span>{t('sending')}</span></>) : (<><Send className="w-6 h-6 group-hover:animate-bounce" /><span>{t('send')}</span></>)}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10"></div>
                <div className="relative p-8 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('ourCoverage')}</h3>
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl border-4 border-green-300 relative overflow-hidden">
                      {[
                        { city: "Antananarivo", top: "30%", left: "45%", color: "bg-red-500" },
                        { city: "Mahajanga", top: "20%", left: "30%", color: "bg-blue-500" },
                        { city: "Toamasina", top: "40%", left: "55%", color: "bg-teal-500" },
                        { city: "Antsirabe", top: "50%", left: "40%", color: "bg-purple-500" },
                        { city: "Fianarantsoa", top: "70%", left: "45%", color: "bg-amber-500" },
                        { city: "Toliara", top: "80%", left: "30%", color: "bg-indigo-500" }
                      ].map((dest, index) => (
                        <div key={dest.city} className={`absolute w-4 h-4 ${dest.color} rounded-full animate-pulse border-2 border-white transform -translate-x-1/2 -translate-y-1/2`} style={{ top: dest.top, left: dest.left, animationDelay: `${index * 0.5}s` }} title={dest.city}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-gray-700 bg-white/90 px-2 py-1 rounded-lg">{dest.city}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-gray-600">{t('coverageDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl border border-gray-100 p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('contactInfo')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-white" /></div>
                    <div><p className="font-semibold text-gray-900">{t('phone')}</p><p className="text-gray-600">+261 34 80 146 56</p></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-white" /></div>
                    <div><p className="font-semibold text-gray-900">{t('email')}</p><p className="text-gray-600">rjnantenaina196@gmail.com</p></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-white" /></div>
                    <div><p className="font-semibold text-gray-900">{t('hours')}</p><p className="text-gray-600">7h00 - 20h00, 7j/7</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${10 + Math.random() * 20}s` }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300"><Car className="w-8 h-8 text-white animate-pulse" /></div>
                <div><div className="text-3xl font-bold">SOATRANS</div>
              </div>
              </div>
              <p className="text-gray-400 leading-relaxed">Votre partenaire de confiance pour découvrir Madagascar en toute sécurité et confort.</p>
              <div className="flex space-x-4">
                {[GlobeIcon, Heart, Target].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 cursor-pointer"><Icon className="w-5 h-5 text-white" /></div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-white">{t('quickLinks')}</h4>
              <ul className="space-y-4">
                {[
                  { labelKey: 'home', action: () => scrollToSection('home') },
                  { labelKey: 'actualites', action: () => scrollToSection('actualites') },
                  { labelKey: 'searchVehicle', action: () => scrollToSection('voitures') },
                  { labelKey: 'contactUs', action: () => scrollToSection('contact') },
                  { labelKey: 'myAccount', action: handleLoginClick }
                ].map((item, index) => (
                  <li key={index}>
                    <button onClick={item.action} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                      <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />{t(item.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-white">{t('legal')}</h4>
              <ul className="space-y-4">
                {['terms', 'privacy', 'legalMentions', 'faq', 'help'].map((item, index) => (
                  <li key={index}><button className="text-gray-400 hover:text-white transition-colors duration-300">{t(item)}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-white">{t('newsletter')}</h4>
              <p className="text-gray-400 mb-4">{t('newsletterDesc')}</p>
              <div className="relative">
                <input type="email" placeholder={t('email')} className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300">{t('subscribe')}</button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">&copy; {new Date().getFullYear()} SOATRANS. {t('rights')}</p>
            
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes gradientText { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes zoom { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes particle { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0; } 10%, 90% { opacity: 1; } 50% { transform: translateY(-100px) translateX(100px); } }

        /* ANIMATIONS POUR LA VOITURE ET LE TITRE */
        @keyframes driveCar {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(-120%); }
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 1s ease-out; }
        .animate-gradientText { background-size: 200% 200%; animation: gradientText 3s ease infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 10s ease infinite; }
        .animate-zoom { animation: zoom 20s ease-in-out infinite; }
        .animate-particle { animation: particle 20s linear infinite; }
        
        .animate-drive { animation: driveCar 8s ease-in-out infinite; }
        .animate-spin-slow { animation: spinSlow 1s linear infinite; }

        .drop-shadow-lg { text-shadow: 0 2px 4px rgba(255,255,255,0.8); }
      `}</style>
    </div>
  );
};

export default HomePage;