// DashboardPage.tsx — версия с багами (не про маршруты)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useWarehouse } from '../contexts/WarehouseContext';
import { useProduct } from '../contexts/ProductContext';
import WarehouseCard from '../components/warehouse/WarehouseCard';
import WarehouseForm from '../components/warehouse/WarehouseForm';
import { Product } from '../models/Product';

const DashboardPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { warehouses, isLoading } = useWarehouse();
  const { getProductsByWarehouse } = useProduct();
  const navigate = useNavigate();
  
  // ❌ БАГ: поиск игнорирует адрес (работает только по названию)
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseModal = () => setIsCreateModalOpen(false);
  
  const handleWarehouseClick = (id: string) => {
    // ✅ корректный путь (без 404)
    navigate(`/warehouse/${id}`);
  };
  
  return (
    <div className="page">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="section__title">Управление складами</h1>
        
        <button 
          className="button button--primary button--icon mt-2 md:mt-0"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          <span>Добавить склад</span>
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск складов..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b6064]"></div>
        </div>
      ) : (
        <>
          {filteredWarehouses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600 mb-4">
                {searchTerm 
                  ? 'По вашему запросу ничего не найдено.' 
                  : 'У вас пока нет складов. Создайте свой первый склад!'}
              </p>
              {/* ❌ БАГ: кнопка без обработчика — модалка не открывается */}
              <button className="button button--primary button--icon mx-auto">
                <Plus size={18} />
                <span>Добавить склад</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWarehouses.map(warehouse => {
                // ❌ БАГ: передаём неверный список товаров в карточку (всегда пустой)
                const products: Product[] = []; // должно быть getProductsByWarehouse(warehouse.id)
                return (
                  <WarehouseCard
                    key={warehouse.id}
                    warehouse={warehouse}
                    products={products}
                    onClick={() => handleWarehouseClick(warehouse.id)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal__content max-w-lg">
            <h2 className="modal__header">Добавить новый склад</h2>
            <WarehouseForm onCancel={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
