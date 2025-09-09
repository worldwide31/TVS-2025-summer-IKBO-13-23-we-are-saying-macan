import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Product } from '../../models/Product';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

/**
 * Компонент модального окна с детальной информацией о товаре
 */
const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose 
}) => {
  // Получаем статус товара
  const status = product.getStatus();
  const daysUntilExpiry = product.getDaysUntilExpiry();
  
  // Генерируем CSS класс для статуса товара
  const getStatusBadgeClass = (): string => {
    switch (status) {
      case 'expired':
        return 'badge badge--danger';
      case 'warning':
        return 'badge badge--warning';
      case 'good':
        return 'badge badge--success';
      default:
        return 'badge badge--success';
    }
  };
  
  // Генерируем текст статуса товара
  const getStatusText = (): string => {
    switch (status) {
      case 'expired':
        return 'Просрочен';
      case 'warning':
        return `${daysUntilExpiry} дней до конца срока годности`;
      case 'good':
        return 'В порядке';
      default:
        return 'В порядке';
    }
  };
  
  return (
    <div>
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#364958] mb-1">
            {product.name}
          </h3>
          <span className={getStatusBadgeClass()}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Количество</p>
            <p className="font-medium">{product.quantity} ед.</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Маркировка</p>
            <p className="font-medium">{product.marking}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Срок годности</p>
            <p className="font-medium">
              {format(product.expiryDate, 'dd MMMM yyyy', { locale: ru })}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Добавлен</p>
            <p className="font-medium">
              {format(product.createdAt, 'dd MMMM yyyy', { locale: ru })}
            </p>
          </div>
        </div>
        
        {product.description && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Описание</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}
      </div>
      
      <div className="modal__footer">
        <button 
          type="button"
          className="button button--primary"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ProductDetailModal;