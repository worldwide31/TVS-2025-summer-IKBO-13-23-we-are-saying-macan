import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';

/**
 * Компонент для защиты маршрутов, требующих авторизации
 */
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Показываем загрузку, пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Оборачиваем защищенные маршруты в общий лейаут
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;