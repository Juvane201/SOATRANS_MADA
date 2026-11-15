// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Admin/Login';
import HomePage from './components/Home/HomePage';
import ReservationPage from './components/Home/ReservationPage';
import Actualites from './pages/Actualites';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/reservation/:voitureId" element={<ReservationPage />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Route admin principale - utilise le layout directement */}
        <Route path="/admin" element={<AdminLayout />} />
        
        {/* Route pour les actualités avec le layout admin */}
        <Route 
          path="/actualites" 
          element={
            <AdminLayout>
              <Actualites />
            </AdminLayout>
          } 
        />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;