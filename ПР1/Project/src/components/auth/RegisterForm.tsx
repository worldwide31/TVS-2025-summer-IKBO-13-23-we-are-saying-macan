import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Компонент формы регистрации
 */
const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Проверка заполнения всех полей
    if (!username || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    // Проверка длины пароля
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при регистрации');
      }
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
        <label htmlFor="username" className="form__label">Имя пользователя</label>
        <input
          type="text"
          id="username"
          className="input"
          placeholder="Иван Иванов"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="email" className="form__label">Email</label>
        <input
          type="email"
          id="email"
          className="input"
          placeholder="example@mail.ru"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="password" className="form__label">Пароль</label>
        <input
          type="password"
          id="password"
          className="input"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form__group">
        <label htmlFor="confirmPassword" className="form__label">Подтверждение пароля</label>
        <input
          type="password"
          id="confirmPassword"
          className="input"
          placeholder="******"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <button 
        type="submit" 
        className="button button--primary w-full mt-6"
        disabled={isLoading}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default RegisterForm;