import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Pages */
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OpinionsPage from './pages/OpinionsPage';
import DashAdminPage from './pages/DashAdminPage';
import DashUserPage from './pages/DashUserPage';
import FormPage from './pages/FormPage';
import DetallesPage from './pages/DetallesPage';

setupIonicReact();

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <DashUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detalles"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <DetallesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opinions"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <OpinionsPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/form"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <FormPage />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect (Catch-all) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;