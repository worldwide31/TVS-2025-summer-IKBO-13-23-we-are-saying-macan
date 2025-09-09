// WarehousePage.tsx — версия с багами (не про маршруты)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { useWarehouse } from '../contexts/WarehouseContext';
import { useProduct, ProductFilters, SortOption } from '../contexts/ProductContext';
import ProductTable from '../components/product/ProductTable';
import ProductForm from '../components/product/ProductForm';
import ProductFilterForm from '../components/product/ProductFilterForm';
import WarehouseInfoCard from '../components/warehouse/WarehouseInfoCard';

const WarehousePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const { getWarehouse } = useWarehouse();
  const {
    products, // оставлено, хотя напрямую не используется
    isLoading,
    getProductsByWarehouse,
    searchProducts,
    filterProducts,
    sortProducts
  } = useProduct();
  
  const warehouse = id ? getWarehouse(id) : undefined;
  
  useEffect(() => {
    if (!warehouse && !isLoading) {
      // ✅ корректный путь (без 404)
      navigate('/dashboard');
    }
  }, [warehouse, isLoading, navigate]);
  
  if (!warehouse || !id) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b6064]"></div>
      </div>
    );
  }
  
  let warehouseProducts = searchTerm
    ? searchProducts(searchTerm, id)
    : getProductsByWarehouse(id);
  
  if (Object.keys(filters).length > 0) {
    warehouseProducts = filterProducts(id, filters);
    
    if (searchTerm) {
      const searchResults = searchProducts(searchTerm, id);
      warehouseProducts = warehouseProducts.filter(product => 
        searchResults.some(p => p.id === product.id)
      );
    }
  }
  
  warehouseProducts = sortProducts(warehouseProducts, sortBy, sortOrder);
  
  const handleBack = () => {
    // ✅ корректный путь (без 404)
    navigate('/dashboard');
  };
  
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseModal = () => setIsCreateModalOpen(false);
  
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  
  const handleApplyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };
  
  const handleResetFilters = () => {
    // ❌ БАГ: фильтры визуально «сбрасываются», но состояние НЕ очищается
    setIsFilterModalOpen(false);
  };
  
  const handleSortChange = (option: SortOption) => {
    // ❌ БАГ: при смене колонки сортировка по умолчанию ставится 'desc', а не 'asc'
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc'); // намеренный баг
    }
  };
  
  return (
    <div className="page">
      <button 
        className="flex items-center text-[#3b6064] hover:text-[#55828b] mb-4"
        onClick={handleBack}
      >
        <ArrowLeft size={18} className="mr-1" />
        <span>Назад к списку складов</span>
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="section__title">{warehouse.name}</h1>
        
        <button 
          className="button button--primary button--icon mt-2 md:mt-0"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          <span>Добавить товар</span>
        </button>
      </div>
      
      <WarehouseInfoCard 
        warehouse={warehouse} 
        products={warehouseProducts}
      />
      
      <div className="bg-white p-4 rounded-lg shadow-md my-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <button 
            className={`button ${Object.keys(filters).length > 0 ? 'button--secondary' : 'bg-gray-200'} button--icon`}
            onClick={handleOpenFilterModal}
          >
            <Filter size={18} />
            <span>
              {Object.keys(filters).length > 0 
                ? `Фильтры (${Object.keys(filters).length})` 
                : 'Фильтры'}
            </span>
          </button>
          
          {Object.keys(filters).length > 0 && (
            <button 
              className="button button--danger button--small"
              onClick={handleResetFilters}
            >
              Сбросить
            </button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b6064]"></div>
        </div>
      ) : (
        <>
          {warehouseProducts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600 mb-4">
                {searchTerm || Object.keys(filters).length > 0
                  ? 'По вашему запросу ничего не найдено.' 
                  : 'На этом складе пока нет товаров. Добавьте первый товар!'}
              </p>
              <button 
                className="button button--primary button--icon mx-auto"
                onClick={handleOpenCreateModal}
              >
                <Plus size={18} />
                <span>Добавить товар</span>
              </button>
            </div>
          ) : (
            <ProductTable 
              products={warehouseProducts}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          )}
        </>
      )}
      
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal__content max-w-lg">
            {/* ❌ БАГ: неверный заголовок модалки */}
            <h2 className="modal__header">Добавить новый склад</h2>
            <ProductForm warehouseId={id} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
      
      {isFilterModalOpen && (
        <div className="modal">
          <div className="modal__content max-w-lg">
            <h2 className="modal__header">Фильтрация товаров</h2>
            <ProductFilterForm 
              initialFilters={filters}
              onApply={handleApplyFilters}
              onCancel={handleCloseFilterModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
