import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../models/Product';
import { useAuth } from './AuthContext';
import { mockProducts } from '../data/mockData';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getProductsByWarehouse: (warehouseId: string) => Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string, warehouseId?: string) => Product[];
  filterProducts: (warehouseId: string, filters: ProductFilters) => Product[];
  sortProducts: (products: Product[], sortBy: SortOption, sortOrder: 'asc' | 'desc') => Product[];
}

export interface ProductFilters {
  status?: 'expired' | 'warning' | 'good';
  minQuantity?: number;
  maxQuantity?: number;
}

export type SortOption = 'name' | 'quantity' | 'expiryDate' | 'createdAt';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

/**
 * Хук для использования контекста продуктов
 */
export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct должен использоваться внутри ProductProvider');
  }
  return context;
};

/**
 * Провайдер контекста продуктов
 */
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Загружаем продукты при авторизации пользователя
    if (user) {
      loadProducts();
    } else {
      // Если пользователь вышел, очищаем продукты
      setProducts([]);
    }
  }, [user]);

  /**
   * Загрузка продуктов
   */
  const loadProducts = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации используем моковые данные с небольшой задержкой
      setTimeout(() => {
        const productInstances = mockProducts.map(p => Product.fromJSON(p));
        setProducts(productInstances);
        setIsLoading(false);
      }, 700);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке продуктов';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  /**
   * Получение продуктов по ID склада
   */
  const getProductsByWarehouse = (warehouseId: string): Product[] => {
    return products.filter(p => p.warehouseId === warehouseId);
  };

  /**
   * Получение продукта по ID
   */
  const getProduct = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  /**
   * Добавление нового продукта
   */
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      const newProduct = new Product(
        Date.now().toString(), // Генерируем временный ID
        productData.warehouseId,
        productData.name,
        productData.quantity,
        productData.marking,
        productData.expiryDate,
        productData.description
      );
      
      setProducts(prevProducts => [...prevProducts, newProduct]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при добавлении продукта';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Обновление существующего продукта
   */
  const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      setProducts(prevProducts => 
        prevProducts.map(product => {
          if (product.id === id) {
            return new Product(
              product.id,
              data.warehouseId || product.warehouseId,
              data.name || product.name,
              data.quantity !== undefined ? data.quantity : product.quantity,
              data.marking || product.marking,
              data.expiryDate || product.expiryDate,
              data.description || product.description,
              product.createdAt,
              new Date() // Обновляем дату изменения
            );
          }
          return product;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при обновлении продукта';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Удаление продукта
   */
  const deleteProduct = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== id)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении продукта';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Поиск продуктов по запросу
   */
  const searchProducts = (query: string, warehouseId?: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    let filteredProducts = products;
    
    if (warehouseId) {
      filteredProducts = filteredProducts.filter(p => p.warehouseId === warehouseId);
    }
    
    return filteredProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.marking.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  /**
   * Фильтрация продуктов
   */
  const filterProducts = (warehouseId: string, filters: ProductFilters): Product[] => {
    return products
      .filter(p => p.warehouseId === warehouseId)
      .filter(product => {
        // Фильтрация по статусу
        if (filters.status && product.getStatus() !== filters.status) {
          return false;
        }
        
        // Фильтрация по минимальному количеству
        if (filters.minQuantity !== undefined && product.quantity < filters.minQuantity) {
          return false;
        }
        
        // Фильтрация по максимальному количеству
        if (filters.maxQuantity !== undefined && product.quantity > filters.maxQuantity) {
          return false;
        }
        
        return true;
      });
  };

  /**
   * Сортировка продуктов
   */
  const sortProducts = (productList: Product[], sortBy: SortOption, sortOrder: 'asc' | 'desc'): Product[] => {
    const sorted = [...productList].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'expiryDate':
          comparison = a.expiryDate.getTime() - b.expiryDate.getTime();
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  const value = {
    products,
    isLoading,
    error,
    getProductsByWarehouse,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProducts,
    sortProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};