import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Компонент формы входа
 */
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе');
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
      
      <button 
        type="submit" 
        className="button button--primary w-full mt-6"
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};

export default LoginForm;