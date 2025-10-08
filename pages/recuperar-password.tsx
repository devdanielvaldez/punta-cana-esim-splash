import { useState } from 'react';
import Link from 'next/link';
import TestBanner from '../components/TestBanner';

export default function RecuperarPassword() {
  // Estados para los campos del formulario y validación
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  // Estados para el manejo de errores y carga
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Formulario, 2: Error, 3: Éxito (nunca usado)

  // Validación básica de email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.trim() === '') {
      setIsValid(true); // No mostrar error si está vacío
    } else {
      setIsValid(validateEmail(newEmail));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar email antes de enviar
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simular una solicitud API que falla después de un tiempo
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Mostrar paso de error
      setError('Error del servidor: No se pudo procesar tu solicitud de recuperación de contraseña. Por favor, inténtalo de nuevo más tarde o contacta con soporte si el problema persiste.');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12">
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#6A7FFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-lg relative z-10">
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

        {/* Tarjeta de recuperación de contraseña */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-8">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-3">Recuperar contraseña</h2>
              <p className="text-gray-400 mb-6">
                Ingresa tu dirección de correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
              </p>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div 
                    className="bg-red-500/20 border border-red-500/50 text-sm px-4 py-3 rounded-lg mb-6"
                  >
                    <p className="text-red-200">{error}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Correo electrónico
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      required
                      value={email}
                      onChange={handleEmailChange}
                      className={`appearance-none block w-full px-4 py-3 bg-gray-900/60 rounded-xl border ${
                        isValid ? 'border-gray-700 focus:border-[#4EBEFF]' : 'border-red-500 focus:border-red-500'
                      } focus:ring-1 ${
                        isValid ? 'focus:ring-[#4EBEFF]' : 'focus:ring-red-500'
                      } text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none`}
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  {!isValid && (
                    <p className="mt-1 text-sm text-red-400">Por favor, introduce un email válido.</p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4">
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
                        Enviando...
                      </>
                    ) : (
                      'Enviar instrucciones'
                    )}
                  </button>
                  
                  <Link 
                    href="/login" 
                    className="text-center text-[#4EBEFF] hover:text-[#75cfff] text-sm transition-colors"
                  >
                    Volver a iniciar sesión
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="bg-red-500/20 border border-red-500/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Error del servidor</h2>
                <p className="text-gray-400 mb-6">
                  {error}
                </p>
                
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => {
                      setError('');
                      setStep(1);
                    }}
                    className="w-full flex justify-center items-center bg-gray-700 hover:bg-gray-600 py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#4EBEFF] transition-all duration-200"
                  >
                    Intentar de nuevo
                  </button>
                  
                  <Link 
                    href="/login" 
                    className="text-center text-[#4EBEFF] hover:text-[#75cfff] text-sm transition-colors"
                  >
                    Volver a iniciar sesión
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Pie de página */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TripTap. Todos los derechos reservados.</p>
        </div>
      </div>
      
      <TestBanner />
    </div>
  );
}
