import React, { useState } from 'react';
import { useProduct } from '../../contexts/ProductContext';

interface ProductFormProps {
  productId?: string;
  warehouseId: string;
  onCancel: () => void;
}

/**
 * Компонент формы создания/редактирования товара
 */
const ProductForm: React.FC<ProductFormProps> = ({ 
  productId,
  warehouseId,
  onCancel
}) => {
  const { getProduct, addProduct, updateProduct, isLoading } = useProduct();
  
  // Если передан ID товара, получаем его данные для редактирования
  const existingProduct = productId ? getProduct(productId) : undefined;
  
  const [name, setName] = useState(existingProduct?.name || '');
  const [quantity, setQuantity] = useState(existingProduct?.quantity.toString() || '1');
  const [marking, setMarking] = useState(existingProduct?.marking || '');
  const [expiryDate, setExpiryDate] = useState(
    existingProduct 
      ? existingProduct.expiryDate.toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [error, setError] = useState('');
  
  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Проверка заполнения обязательных полей
    if (!name || !quantity || !marking || !expiryDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Проверка корректности количества
    const quantityNumber = parseInt(quantity, 10);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      setError('Количество должно быть положительным числом');
      return;
    }
    
    try {
      if (existingProduct && productId) {
        // Обновление существующего товара
        await updateProduct(productId, {
          name,
          quantity: quantityNumber,
          marking,
          expiryDate: new Date(expiryDate),
          description
        });
      } else {
        // Создание нового товара
        await addProduct({
          warehouseId,
          name,
          quantity: quantityNumber,
          marking,
          expiryDate: new Date(expiryDate),
          description
        });
      }
      
      onCancel(); // Закрываем форму после успешного сохранения
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при сохранении товара';
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
        <label htmlFor="name" className="form__label">Наименование товара*</label>
        <input
          type="text"
          id="name"
          className="input"
          placeholder="Например: Молоко пастеризованное"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="quantity" className="form__label">Количество (единиц)*</label>
        <input
          type="number"
          id="quantity"
          className="input"
          placeholder="1"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="marking" className="form__label">Маркировка*</label>
        <input
          type="text"
          id="marking"
          className="input"
          placeholder="Например: МЛК-2023-001"
          value={marking}
          onChange={(e) => setMarking(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="expiryDate" className="form__label">Срок годности*</label>
        <input
          type="date"
          id="expiryDate"
          className="input"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="description" className="form__label">Описание</label>
        <textarea
          id="description"
          className="input min-h-[100px]"
          placeholder="Дополнительная информация о товаре..."
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
            : existingProduct 
              ? 'Обновить товар' 
              : 'Добавить товар'
          }
        </button>
      </div>
    </form>
  );
};

export default ProductForm;