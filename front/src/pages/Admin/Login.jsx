import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Lock, User, Eye, EyeOff, LogIn, Shield, 
  AlertCircle, CheckCircle, Car, Key, Languages
} from 'lucide-react';

const Login = () => {
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState('fr');
  const navigate = useNavigate();

  // URL par défaut si VITE_API_URL est undefined
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

  // ✅ Traductions
  const translations = {
    fr: {
      title: 'SOATRANS',
      subtitle: 'Administrateur',
      description: 'Accédez au panneau d\'administration',
      secureLogin: 'Connexion Sécurisée',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      placeholderUsername: 'admin',
      placeholderPassword: '••••••••',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      forgotAlert: 'Contactez l\'administrateur pour réinitialiser votre mot de passe.',
      login: 'Se connecter',
      loggingIn: 'Connexion en cours...',
      successMessage: 'Connexion réussie ! Redirection en cours...',
      errorEmpty: 'Veuillez remplir tous les champs',
      error401: 'Nom d\'utilisateur ou mot de passe incorrect',
      error422: 'Données invalides',
      error500: 'Erreur serveur. Veuillez contacter l\'administrateur',
      error404: 'Service non disponible. Vérifiez l\'URL de l\'API',
      errorNetwork: 'Impossible de contacter le serveur. Vérifiez votre connexion internet et que le serveur Laravel est démarré.',
      errorTimeout: 'Le délai de connexion a expiré. Vérifiez votre connexion.',
      errorDefault: 'Erreur lors de la connexion. Veuillez réessayer.',
      errorUnknown: 'Erreur inconnue',
      footer: 'Tous droits réservés',
      language: 'Langue'
    },
    en: {
      title: 'SOATRANS',
      subtitle: 'Administrator',
      description: 'Access the administration panel',
      secureLogin: 'Secure Login',
      username: 'Username',
      password: 'Password',
      placeholderUsername: 'admin',
      placeholderPassword: '••••••••',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      forgotAlert: 'Contact the administrator to reset your password.',
      login: 'Login',
      loggingIn: 'Logging in...',
      successMessage: 'Login successful! Redirecting...',
      errorEmpty: 'Please fill in all fields',
      error401: 'Invalid username or password',
      error422: 'Invalid data',
      error500: 'Server error. Please contact the administrator',
      error404: 'Service unavailable. Check the API URL',
      errorNetwork: 'Unable to contact the server. Check your internet connection and make sure the Laravel server is running.',
      errorTimeout: 'Connection timeout. Check your connection.',
      errorDefault: 'Connection error. Please try again.',
      errorUnknown: 'Unknown error',
      footer: 'All rights reserved',
      language: 'Language'
    }
  };

  // ✅ Fonction pour obtenir la traduction
  const t = (key) => {
    return translations[language][key] || key;
  };

  // ✅ Fonction pour changer de langue
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation simple
    if (!nom.trim() || !code.trim()) {
      setError(t('errorEmpty'));
      setLoading(false);
      return;
    }

    console.log('Tentative de connexion avec:', { nom, code });

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        nom,
        code,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 secondes timeout
      });

      console.log('Réponse reçue:', response.data);

      // Stocker le token
      localStorage.setItem('token', response.data.token);
      if (response.data.admin) {
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
      }

      // Option "Se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem('rememberedUser', nom);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      // Message de succès
      setSuccess(t('successMessage'));

      // Redirection après un délai
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (err) {
      console.error('Erreur détaillée:', err);
      
      let errorMessage = t('errorDefault');
      
      if (err.response) {
        // 👇 SI LARAVEL RENVOIE UNE ERREUR 500, ON AFFICHE LE MESSAGE EXACT
        if (err.response.status === 500) {
          errorMessage = `Erreur Serveur : ${err.response.data.error || err.response.data.message || 'Erreur inconnue'}`;
          console.error("Détails de l'erreur Laravel :", err.response.data);
        } else {
          // Pour les autres erreurs (401, 422, etc.)
          errorMessage = err.response.data?.message || t('errorDefault');
        }
      } else if (err.request) {
        errorMessage = t('errorNetwork');
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = t('errorTimeout');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Charger l'utilisateur mémorisé au chargement
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setNom(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mb-4 shadow-lg">
            <div className="relative">
              <Car className="w-10 h-10 text-white" />
              <Key className="w-4 h-4 text-white absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('title')}
            <span className="text-blue-300"> {t('subtitle')}</span>
          </h1>
          <p className="text-gray-300">{t('description')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8">
            {/* Header with language toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              
              {/* ✅ Bouton de langue moderne */}
              <button
                onClick={toggleLanguage}
                className="relative group flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    {language === 'fr' ? 'FR' : 'EN'}
                  </span>
                  <div className="w-6 h-4 bg-gray-200 rounded-full relative group-hover:bg-blue-200 transition-colors duration-300">
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 ${
                      language === 'en' 
                        ? 'translate-x-3 bg-blue-600' 
                        : 'translate-x-0.5 bg-cyan-500'
                    }`}></div>
                  </div>
                </div>
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              {t('secureLogin')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom field */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {t('username')}
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="pl-10 w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-700"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    {t('password')}
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="code"
                    type={showPassword ? 'text' : 'password'}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pl-10 pr-10 w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-700"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-600">{t('rememberMe')}</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  onClick={() => alert(t('forgotAlert'))}
                >
                  {t('forgotPassword')}
                </button>
              </div>

              {/* Messages d'état */}
              {error && (
                <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-red-600 text-sm">{error}</div>
                </div>
              )}

              {success && (
                <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-green-600 text-sm">{success}</div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 ${
                  loading 
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:shadow-xl hover:shadow-blue-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('loggingIn')}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{t('login')}</span>
                  </>
                )}
              </button>
            </form>

            {/* Help text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                <span className="text-xs opacity-75">
                 SOATRANS MADAGASCAR
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            © 2026 SOATRANS • {t('footer')}
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-8 left-8 text-blue-300/30">
        <Car className="w-16 h-16" />
      </div>
      <div className="absolute top-8 right-8 text-cyan-300/30">
        <Key className="w-12 h-12" />
      </div>

      {/* Styles additionnels */}
      <style jsx>{`
        .placeholder-gray-700::placeholder {
          color: #374151;
          opacity: 1;
        }
        .placeholder-gray-700:-ms-input-placeholder {
          color: #374151;
        }
        .placeholder-gray-700::-ms-input-placeholder {
          color: #374151;
        }
      `}</style>
    </div>
  );
};  

export default Login;