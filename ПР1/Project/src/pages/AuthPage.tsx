import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

/**
 * Страница аутентификации пользователя
 */
const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Если пользователь уже авторизован, перенаправляем на dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Если страница загружается, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b6064]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#364958] to-[#55828b] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-[#364958] mb-6">
            {isLogin ? 'Вход в систему' : 'Регистрация'}
          </h1>
          
          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm />
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#55828b] hover:text-[#3b6064] transition-colors"
            >
              {isLogin 
                ? 'Еще нет аккаунта? Зарегистрироваться' 
                : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t">
          <p className="text-center text-sm text-gray-600">
            Демо-аккаунт: demo@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;