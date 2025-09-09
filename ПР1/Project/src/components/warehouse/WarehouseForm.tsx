import React, { useState } from 'react';
import { useWarehouse } from '../../contexts/WarehouseContext';

interface WarehouseFormProps {
  warehouseId?: string;
  onCancel: () => void;
}

/**
 * Компонент формы создания/редактирования склада
 */
const WarehouseForm: React.FC<WarehouseFormProps> = ({ 
  warehouseId,
  onCancel
}) => {
  const { getWarehouse, addWarehouse, updateWarehouse, isLoading } = useWarehouse();
  
  // Если передан ID склада, получаем его данные для редактирования
  const existingWarehouse = warehouseId ? getWarehouse(warehouseId) : undefined;
  
  const [name, setName] = useState(existingWarehouse?.name || '');
  const [address, setAddress] = useState(existingWarehouse?.address || '');
  const [capacity, setCapacity] = useState(existingWarehouse?.capacity.toString() || '100');
  const [description, setDescription] = useState(existingWarehouse?.description || '');
  const [error, setError] = useState('');
  
  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Проверка заполнения обязательных полей
    if (!name || !address || !capacity) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Проверка корректности вместимости
    const capacityNumber = parseInt(capacity, 10);
    if (isNaN(capacityNumber) || capacityNumber <= 0) {
      setError('Вместимость должна быть положительным числом');
      return;
    }
    
    try {
      if (existingWarehouse && warehouseId) {
        // Обновление существующего склада
        await updateWarehouse(warehouseId, {
          name,
          address,
          capacity: capacityNumber,
          description
        });
      } else {
        // Создание нового склада
        await addWarehouse({
          name,
          address,
          capacity: capacityNumber,
          description
        });
      }
      
      onCancel(); // Закрываем форму после успешного сохранения
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при сохранении склада';
      setError(errorMessage);
    }
  };
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <div className="form__group">
        <label htmlFor="name" className="form__label">Название склада*</label>
        <input
          type="text"
          id="name"
          className="input"
          placeholder="Например: Центральный склад"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="address" className="form__label">Адрес*</label>
        <input
          type="text"
          id="address"
          className="input"
          placeholder="Например: ул. Складская, 1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="capacity" className="form__label">Вместимость (единиц)*</label>
        <input
          type="number"
          id="capacity"
          className="input"
          placeholder="100"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="description" className="form__label">Описание</label>
        <textarea
          id="description"
          className="input min-h-[100px]"
          placeholder="Дополнительная информация о складе..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>
      
      <div className="modal__footer">
        <button 
          type="button" 
          className="button bg-gray-200 hover:bg-gray-300"
          onClick={onCancel}
          disabled={isLoading}
        >
          Отмена
        </button>
        
        <button 
          type="submit" 
          className="button button--primary"
          disabled={isLoading}
        >
          {isLoading 
            ? 'Сохранение...' 
            : existingWarehouse 
              ? 'Обновить склад' 
              : 'Создать склад'
          }
        </button>
      </div>
    </form>
  );
};

export default WarehouseForm;