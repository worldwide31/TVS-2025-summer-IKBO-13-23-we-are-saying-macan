import React, { createContext, useContext, useState, useEffect } from 'react';
import { Warehouse } from '../models/Warehouse';
import { useAuth } from './AuthContext';
import { mockWarehouses } from '../data/mockData';

interface WarehouseContextType {
  warehouses: Warehouse[];
  isLoading: boolean;
  error: string | null;
  getWarehouse: (id: string) => Warehouse | undefined;
  addWarehouse: (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => Promise<void>;
  deleteWarehouse: (id: string) => Promise<void>;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

/**
 * Хук для использования контекста складов
 */
export const useWarehouse = (): WarehouseContextType => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse должен использоваться внутри WarehouseProvider');
  }
  return context;
};

/**
 * Провайдер контекста складов
 */
export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Загружаем склады при авторизации пользователя
    if (user) {
      loadWarehouses();
    } else {
      // Если пользователь вышел, очищаем склады
      setWarehouses([]);
    }
  }, [user]);

  /**
   * Загрузка складов
   */
  const loadWarehouses = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации используем моковые данные с небольшой задержкой
      setTimeout(() => {
        const warehouseInstances = mockWarehouses.map(w => Warehouse.fromJSON(w));
        setWarehouses(warehouseInstances);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке складов';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  /**
   * Получение склада по ID
   */
  const getWarehouse = (id: string): Warehouse | undefined => {
    return warehouses.find(w => w.id === id);
  };

  /**
   * Добавление нового склада
   */
  const addWarehouse = async (warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      const newWarehouse = new Warehouse(
        Date.now().toString(), // Генерируем временный ID
        warehouseData.name,
        warehouseData.address,
        warehouseData.capacity,
        warehouseData.description
      );
      
      setWarehouses(prevWarehouses => [...prevWarehouses, newWarehouse]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при добавлении склада';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Обновление существующего склада
   */
  const updateWarehouse = async (id: string, data: Partial<Warehouse>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      setWarehouses(prevWarehouses => 
        prevWarehouses.map(warehouse => {
          if (warehouse.id === id) {
            return new Warehouse(
              warehouse.id,
              data.name || warehouse.name,
              data.address || warehouse.address,
              data.capacity !== undefined ? data.capacity : warehouse.capacity,
              data.description || warehouse.description,
              warehouse.createdAt,
              new Date() // Обновляем дату изменения
            );
          }
          return warehouse;
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при обновлении склада';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Удаление склада
   */
  const deleteWarehouse = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      setWarehouses(prevWarehouses => 
        prevWarehouses.filter(warehouse => warehouse.id !== id)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при удалении склада';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    warehouses,
    isLoading,
    error,
    getWarehouse,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  };

  return <WarehouseContext.Provider value={value}>{children}</WarehouseContext.Provider>;
};