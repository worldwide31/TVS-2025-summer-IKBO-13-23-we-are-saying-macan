import React from 'react';
import { NavLink } from 'react-router-dom';
import { Warehouse, BarChart2 } from 'lucide-react';

/**
 * Компонент боковой панели навигации
 */
const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 bg-[#3b6064] text-white">
      <div className="p-4">
        <h2 className="text-lg font-medium mb-6">Навигация</h2>
        
        <nav className="space-y-2">
          <NavLink 
            to="/dashboard/analytics" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-[#55828b] text-white' 
                  : 'hover:bg-[#55828b] text-gray-200'
              }`
            }
            end
          >
            <BarChart2 size={20} />
            <span>Аналитика</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-[#55828b] text-white' 
                  : 'hover:bg-[#55828b] text-gray-200'
              }`
            }
            end
          >
            <Warehouse size={20} />
            <span>Склады</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar