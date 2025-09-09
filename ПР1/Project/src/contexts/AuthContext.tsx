import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/User';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Хук для использования контекста авторизации
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

/**
 * Провайдер контекста авторизации
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем наличие сохраненного пользователя при загрузке
    const storedUser = localStorage.getItem('warehouseUser');
    if (storedUser) {
      try {
        setUser(User.fromJSON(JSON.parse(storedUser)));
      } catch (err) {
        console.error('Ошибка при разборе данных пользователя:', err);
        localStorage.removeItem('warehouseUser');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Авторизация пользователя
   */
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации используем моковые данные
      
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = new User(
          '1',
          'Демо Пользователь',
          'demo@example.com',
          'mock-jwt-token'
        );
        
        setUser(mockUser);
        localStorage.setItem('warehouseUser', JSON.stringify(mockUser.toJSON()));
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при входе';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Регистрация нового пользователя
   */
  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к API
      // Для демонстрации создаем моковый аккаунт
      
      if (email === 'demo@example.com') {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      const mockUser = new User(
        Date.now().toString(),
        username,
        email,
        'mock-jwt-token'
      );
      
      setUser(mockUser);
      localStorage.setItem('warehouseUser', JSON.stringify(mockUser.toJSON()));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при регистрации';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Выход пользователя из системы
   */
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('warehouseUser');
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};