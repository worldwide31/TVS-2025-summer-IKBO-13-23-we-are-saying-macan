import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Страница 404 (не найдено)
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-[#364958] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#3b6064] mb-6">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <button 
          className="button button--primary button--icon mx-auto"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>Вернуться на главную</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;