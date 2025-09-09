// AnalyticsPage.tsx — версия с багами (логика/визуал, без маршрутов)
import React from 'react';
import { useWarehouse } from '../contexts/WarehouseContext';
import { useProduct } from '../contexts/ProductContext';
import { BarChart, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Страница аналитики
 */
const AnalyticsPage: React.FC = () => {
  const { warehouses } = useWarehouse();
  const { products } = useProduct();

  // Общая статистика
  const totalWarehouses = warehouses.length;
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0);
  
  // Статистика по срокам годности
  const expiredProducts = products.filter(p => p.getStatus() === 'expired');
  const warningProducts = products.filter(p => p.getStatus() === 'warning');
  const goodProducts = products.filter(p => p.getStatus() === 'good');

  return (
    <div className="page">
      <h1 className="section__title">Аналитика</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#e9f2ed] p-3 rounded-md">
              <BarChart className="text-[#3b6064]" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#364958]">{totalWarehouses}</span>
          </div>
          <h3 className="text-gray-600">Всего складов</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#e9f2ed] p-3 rounded-md">
              <TrendingUp className="text-[#3b6064]" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#364958]">{totalProducts}</span>
          </div>
          {/* ❌ БАГ: заголовок не соответствует числу (на самом деле это количество типов) */}
          <h3 className="text-gray-600">Всего товаров</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#e9f2ed] p-3 rounded-md">
              <AlertTriangle className="text-[#3b6064]" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#364958]">{totalUnits}</span>
          </div>
          <h3 className="text-gray-600">Всего единиц</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#e9f2ed] p-3 rounded-md">
              <CheckCircle className="text-[#3b6064]" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#364958]">
              {/* ❌ БАГ: условие завязано на количестве складов, а не товаров */}
              {warehouses.length > 0 
                ? Math.round((goodProducts.length / totalProducts) * 100)
                : 0}%
            </span>
          </div>
          <h3 className="text-gray-600">Товаров в норме</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#364958] mb-4">
            Статус товаров
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Просрочено</span>
                <span className="font-medium text-red-600">{expiredProducts.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* ❌ БАГ: при 0 товарах получится NaN% ширина */}
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ 
                    width: `${(expiredProducts.length / totalProducts) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Заканчивается срок</span>
                <span className="font-medium text-orange-600">{warningProducts.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* ❌ БАГ: неверный цвет прогресса (должен быть оранжевый) */}
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ 
                    width: `${(warningProducts.length / totalProducts) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">В норме</span>
                <span className="font-medium text-green-600">{goodProducts.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ 
                    width: `${(goodProducts.length / totalProducts) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#364958] mb-4">
            Загруженность складов
          </h2>
          <div className="space-y-4">
            {warehouses.map(warehouse => {
              const warehouseProducts = products.filter(p => p.warehouseId === warehouse.id);
              const totalQuantity = warehouseProducts.reduce((sum, p) => sum + p.quantity, 0);
              // ❌ БАГ: передаём неверный аргумент (кол-во типов вместо суммарного количества)
              const occupancyPercentage = warehouse.getOccupancyPercentage(warehouseProducts.length);

              return (
                <div key={warehouse.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">{warehouse.name}</span>
                    <span className={`font-medium ${
                      occupancyPercentage > 90
                        ? 'text-red-600'
                        : occupancyPercentage > 70
                          ? 'text-orange-600'
                          : 'text-green-600'
                    }`}>
                      {occupancyPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        occupancyPercentage > 90
                          ? 'bg-red-500'
                          : occupancyPercentage > 70
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
