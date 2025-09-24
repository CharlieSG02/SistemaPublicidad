import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/supabase';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.signIn({ email, password });
      navigate('/');
    } catch (err) {
      if (err.message === 'Invalid login credentials') {
        setError('Credenciales inválidas. Verifique su email y contraseña.');
      } else if (err.message === 'Email not confirmed') {
        setError('Su correo electrónico no ha sido confirmado. Por favor, revise su bandeja de entrada (y la carpeta de spam) y haga clic en el enlace de confirmación.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, inténtelo más tarde.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="mt-2 text-gray-600">Bienvenido de nuevo</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : <> <LogIn className="mr-2 h-5 w-5" /> Iniciar Sesión </>}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
