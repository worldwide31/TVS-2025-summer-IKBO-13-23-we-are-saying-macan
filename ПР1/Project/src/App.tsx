import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WarehousePage from './pages/WarehousePage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import { WarehouseProvider } from './contexts/WarehouseContext';
import { ProductProvider } from './contexts/ProductContext';
import ProtectedRoute from './components/routes/ProtectedRoute';

/**
 * Главный компонент приложения
 * Настраивает провайдеры контекста и маршрутизацию
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WarehouseProvider>
          <ProductProvider>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<AuthPage />} />
              
              {/* Защищенные маршруты */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/warehouse/:id" element={<WarehousePage />} />
              </Route>
              
              {/* Страница 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ProductProvider>
        </WarehouseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;