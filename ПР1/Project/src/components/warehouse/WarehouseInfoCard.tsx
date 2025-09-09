import React from 'react';
import { MapPin, Package, Calendar } from 'lucide-react';
import { Warehouse } from '../../models/Warehouse';
import { Product } from '../../models/Product';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface WarehouseInfoCardProps {
  warehouse: Warehouse;
  products: Product[];
}

/**
 * Компонент карточки информации о складе
 */
const WarehouseInfoCard: React.FC<WarehouseInfoCardProps> = ({ 
  warehouse, 
  products 
}) => {
  // Получаем общее количество товаров
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  
  // Получаем процент занятости склада
  const occupancyPercentage = warehouse.getOccupancyPercentage(totalQuantity);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="p-6 flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <div className="flex items-center mb-2">
                <MapPin size={18} className="text-[#55828b] mr-2" />
                <span className="text-gray-600">{warehouse.address}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={18} className="text-[#55828b] mr-2" />
                <span className="text-gray-600">
                  Создан: {format(warehouse.createdAt, 'dd MMMM yyyy', { locale: ru })}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center bg-[#e9f2ed] px-3 py-2 rounded-md">
              <Package size={18} className="text-[#3b6064] mr-2" />
              <span className="font-medium text-[#364958]">
                {totalQuantity} / {warehouse.capacity} единиц товара
              </span>
            </div>
          </div>
          
          {warehouse.description && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Описание:</h3>
              <p className="text-gray-600">{warehouse.description}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-gray-50 md:w-64 border-t md:border-t-0 md:border-l border-gray-100">
          <h3 className="font-medium text-gray-700 mb-3">Заполненность склада</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Всего мест:</span>
              <span className="font-medium">{warehouse.capacity}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Занято:</span>
              <span className="font-medium">{totalQuantity}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Свободно:</span>
              <span className="font-medium">{warehouse.capacity - totalQuantity}</span>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Заполнено:</span>
                <span className={`font-medium ${
                  occupancyPercentage > 90
                    ? 'text-red-600'
                    : occupancyPercentage > 70
                      ? 'text-orange-600'
                      : 'text-[#55828b]'
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
                        : 'bg-[#87bba2]'
                  }`}
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseInfoCard;