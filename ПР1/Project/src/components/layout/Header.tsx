import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  username: string;
}

/**
 * Компонент шапки приложения
 */
const Header: React.FC<HeaderProps> = ({ username }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-[#364958] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-3"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <h1 className="text-xl font-bold">СкладМастер</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block">
              Привет, {username}
            </span>
            
            <button 
              className="flex items-center space-x-1 text-sm bg-[#55828b] hover:bg-[#3b6064] transition-colors px-3 py-1 rounded-md"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden bg-[#3b6064] py-2 shadow-inner">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-2">
              <a 
                href="/dashboard/analytics" 
                className={`text-white hover:bg-[#55828b] rounded px-2 py-1 ${
                  location.pathname === '/dashboard/analytics' ? 'bg-[#55828b]' : ''
                }`}
              >
                Аналитика
              </a>
              <a 
                href="/dashboard" 
                className={`text-white hover:bg-[#55828b] rounded px-2 py-1 ${
                  location.pathname === '/dashboard' ? 'bg-[#55828b]' : ''
                }`}
              >
                Склады
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header