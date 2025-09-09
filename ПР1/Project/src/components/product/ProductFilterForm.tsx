import React, { useState } from 'react';
import { ProductFilters } from '../../contexts/ProductContext';

interface ProductFilterFormProps {
  initialFilters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  onCancel: () => void;
}

/**
 * Компонент формы фильтрации товаров
 */
const ProductFilterForm: React.FC<ProductFilterFormProps> = ({ 
  initialFilters, 
  onApply, 
  onCancel 
}) => {
  const [status, setStatus] = useState<string>(initialFilters.status || '');
  const [minQuantity, setMinQuantity] = useState<string>(
    initialFilters.minQuantity !== undefined ? initialFilters.minQuantity.toString() : ''
  );
  const [maxQuantity, setMaxQuantity] = useState<string>(
    initialFilters.maxQuantity !== undefined ? initialFilters.maxQuantity.toString() : ''
  );
  
  // Обработчик применения фильтров
  const handleApply = () => {
    const filters: ProductFilters = {};
    
    if (status) {
      filters.status = status as 'expired' | 'warning' | 'good';
    }
    
    if (minQuantity) {
      filters.minQuantity = parseInt(minQuantity, 10);
    }
    
    if (maxQuantity) {
      filters.maxQuantity = parseInt(maxQuantity, 10);
    }
    
    onApply(filters);
  };
  
  return (
    <div className="form">
      <div className="form__group">
        <label htmlFor="status" className="form__label">Статус товара</label>
        <select
          id="status"
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="expired">Просроченные</option>
          <option value="warning">Заканчивается срок годности</option>
          <option value="good">В порядке</option>
        </select>
      </div>
      
      <div className="form__group">
        <label htmlFor="minQuantity" className="form__label">Минимальное количество</label>
        <input
          type="number"
          id="minQuantity"
          className="input"
          placeholder="Например: 10"
          min="0"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="maxQuantity" className="form__label">Максимальное количество</label>
        <input
          type="number"
          id="maxQuantity"
          className="input"
          placeholder="Например: 100"
          min="0"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
        />
      </div>
      
      <div className="modal__footer">
        <button 
          type="button" 
          className="button bg-gray-200 hover:bg-gray-300"
          onClick={onCancel}
        >
          Отмена
        </button>
        
        <button 
          type="button" 
          className="button button--primary"
          onClick={handleApply}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

export default ProductFilterForm;