import React from 'react';
import { Warehouse, Package } from 'lucide-react';
import { Warehouse as WarehouseModel } from '../../models/Warehouse';
import { Product } from '../../models/Product';

interface WarehouseCardProps {
  warehouse: WarehouseModel;
  products: Product[];
  onClick: () => void;
}

/**
 * Компонент карточки склада
 */
const WarehouseCard: React.FC<WarehouseCardProps> = ({ 
  warehouse, 
  products, 
  onClick 
}) => {
  // Получаем общее количество товаров
  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  
  // Получаем процент занятости склада
  const occupancyPercentage = warehouse.getOccupancyPercentage(totalQuantity);
  
  return (
    <div 
      className="card hover:translate-y-[-3px] cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[#e9f2ed] p-3 rounded-md">
          <Warehouse className="text-[#3b6064]" size={24} />
        </div>
        <span className="badge badge--success">
          {products.length} типов товаров
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-[#364958] mb-2">
        {warehouse.name}
      </h3>
      
      <p className="text-gray-600 mb-4 text-sm">
        {warehouse.address}
      </p>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Вместимость:</span>
          <span className="font-medium">{warehouse.capacity} ед.</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Занято:</span>
          <span className="font-medium">{totalQuantity} ед.</span>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Заполнено:</span>
            <span className="font-medium">{occupancyPercentage}%</span>
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
      
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
        <Package size={16} className="text-[#55828b] mr-2" />
        <span className="text-[#3b6064] font-medium">Просмотреть товары</span>
      </div>
    </div>
  );
};

export default WarehouseCard;