import { useState } from 'react';
import Link from 'next/link';
import TestBanner from '../components/TestBanner';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  
  // Estados para los campos del formulario
  const [type, setType] = useState('empresa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para el manejo de errores y carga
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApiError(false);
    
    // Validación básica
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Implementación real de la solicitud de registro
      const response = await fetch('https://api.triptapmedia.com/api/advertisiment/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          type, // Enviar también el tipo (empresa o agencia)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error en el registro');
      }

      // Registro exitoso
      // Redirigir al login o mostrar mensaje de éxito
      router.push('/login?registered=true');
      
    } catch (error) {
      setApiError(true);
      setError(error instanceof Error ? 
        error.message : 
        'Error de conexión: No se ha podido conectar con el servidor. Por favor, inténtalo de nuevo más tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12">
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex justify-center mb-2">
              <div className="h-25 w-25 flex items-center justify-center">
                <img src="images/logo.png" alt="TripTap Logo" />
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de registro */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Crear una cuenta</h2>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div 
                className={`${
                  apiError ? 'bg-red-500/20 border-red-500/50' : 'bg-amber-500/20 border-amber-500/50'
                } border text-sm px-4 py-3 rounded-lg mb-6`}
              >
                <p className={`${apiError ? 'text-red-200' : 'text-amber-200'}`}>{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              
              {/* Nombre de la Empresa o Agencia */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre de la empresa
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder={`Nombre de la empresa`}
                  />
                </div>
              </div>
              
              {/* Email */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder="email@empresa.com"
                  />
                </div>
              </div>
              
              {/* Teléfono */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Teléfono
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder="+1 809 000 0000"
                  />
                </div>
              </div>
              
              {/* Contraseña */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              {/* Confirmar Contraseña */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#4EBEFF] focus:ring-1 focus:ring-[#4EBEFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              {/* Términos y Condiciones */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 bg-gray-900 border-gray-700 rounded focus:ring-[#4EBEFF] text-cyan-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-400">
                      Acepto los <Link href="#" className="text-[#4EBEFF] hover:text-[#75cfff]">Términos y Condiciones</Link> y la <Link href="#" className="text-[#4EBEFF] hover:text-[#75cfff]">Política de Privacidad</Link>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Botón de Registro */}
              <div className="col-span-1 md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] hover:from-[#ff7cff] hover:to-[#75cfff] py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#4EBEFF] transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando cuenta...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[#4EBEFF] hover:text-[#75cfff] font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TripTap. Todos los derechos reservados.</p>
        </div>
      </div>

    </div>
  );
}