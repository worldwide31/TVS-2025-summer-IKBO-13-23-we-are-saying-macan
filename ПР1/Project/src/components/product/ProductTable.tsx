import React, { useState } from 'react';
import { ArrowUpDown, Eye, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Product } from '../../models/Product';
import { useProduct, SortOption } from '../../contexts/ProductContext';
import ProductForm from './ProductForm';
import ProductDetailModal from './ProductDetailModal';

interface ProductTableProps {
  products: Product[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  onSortChange: (option: SortOption) => void;
}

/**
 * Компонент таблицы товаров
 */
const ProductTable: React.FC<ProductTableProps> = ({ 
  products,
  sortBy,
  sortOrder,
  onSortChange
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { deleteProduct } = useProduct();
  
  // Обработчик отображения модального окна с деталями товара
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };
  
  // Обработчик отображения модального окна редактирования товара
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  
  // Обработчик отображения модального окна удаления товара
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  // Обработчик закрытия всех модальных окон
  const handleCloseModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };
  
  // Обработчик подтверждения удаления товара
  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      handleCloseModals();
    }
  };
  
  // Генерируем CSS класс для статуса товара
  const getStatusBadgeClass = (product: Product): string => {
    const status = product.getStatus();
    
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
  const getStatusText = (product: Product): string => {
    const status = product.getStatus();
    const daysUntilExpiry = product.getDaysUntilExpiry();
    
    switch (status) {
      case 'expired':
        return 'Просрочен';
      case 'warning':
        return `${daysUntilExpiry} дн. до конца срока`;
      case 'good':
        return 'В порядке';
      default:
        return 'В порядке';
    }
  };
  
  // Получаем иконку для сортировки
  const getSortIcon = (field: SortOption) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} />;
    }
    
    return sortOrder === 'asc' ? '↑' : '↓';
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="table__header">
                <th 
                  className="table__cell cursor-pointer"
                  onClick={() => onSortChange('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Наименование</span>
                    <span className="opacity-60">{getSortIcon('name')}</span>
                  </div>
                </th>
                <th 
                  className="table__cell cursor-pointer"
                  onClick={() => onSortChange('quantity')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Количество</span>
                    <span className="opacity-60">{getSortIcon('quantity')}</span>
                  </div>
                </th>
                <th className="table__cell">Маркировка</th>
                <th 
                  className="table__cell cursor-pointer"
                  onClick={() => onSortChange('expiryDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Срок годности</span>
                    <span className="opacity-60">{getSortIcon('expiryDate')}</span>
                  </div>
                </th>
                <th className="table__cell">Статус</th>
                <th className="table__cell">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="table__row">
                  <td className="table__cell font-medium text-[#364958]">
                    {product.name}
                  </td>
                  <td className="table__cell">
                    {product.quantity} ед.
                  </td>
                  <td className="table__cell">
                    {product.marking}
                  </td>
                  <td className="table__cell">
                    {format(product.expiryDate, 'dd.MM.yyyy', { locale: ru })}
                  </td>
                  <td className="table__cell">
                    <span className={getStatusBadgeClass(product)}>
                      {getStatusText(product)}
                    </span>
                  </td>
                  <td className="table__cell">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleView(product)}
                        title="Просмотреть"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button 
                        className="p-1 text-[#55828b] hover:text-[#3b6064] transition-colors"
                        onClick={() => handleEdit(product)}
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button 
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => handleDelete(product)}
                        title="Удалить"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Модальное окно просмотра товара */}
      {isViewModalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal__content max-w-lg">
            <h2 className="modal__header">Информация о товаре</h2>
            <ProductDetailModal product={selectedProduct} onClose={handleCloseModals} />
          </div>
        </div>
      )}
      
      {/* Модальное окно редактирования товара */}
      {isEditModalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal__content max-w-lg">
            <h2 className="modal__header">Редактировать товар</h2>
            <ProductForm 
              productId={selectedProduct.id}
              warehouseId={selectedProduct.warehouseId}
              onCancel={handleCloseModals} 
            />
          </div>
        </div>
      )}
      
      {/* Модальное окно удаления товара */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="modal">
          <div className="modal__content max-w-md">
            <h2 className="modal__header text-red-600">Удаление товара</h2>
            <p className="mb-6">
              Вы уверены, что хотите удалить товар "{selectedProduct.name}"? Это действие нельзя отменить.
            </p>
            
            <div className="modal__footer">
              <button 
                className="button bg-gray-200 hover:bg-gray-300"
                onClick={handleCloseModals}
              >
                Отмена
              </button>
              
              <button 
                className="button button--danger"
                onClick={handleConfirmDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;