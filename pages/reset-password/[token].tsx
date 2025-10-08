// pages/reset-password/[token].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Si no hay token, redirige al login
  useEffect(() => {
    if (token === undefined) return;
    if (!token) router.replace('/login');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://api.triptapmedia.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok || data.ok !== true) {
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12 relative">
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF5A5A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#5A8EFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#FF9F5A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-8">
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Restablecer Contraseña
              </h2>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#5A8EFF] focus:ring-1 focus:ring-[#5A8EFF] text-white placeholder-gray-500 shadow-sm transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/60 rounded-xl border border-gray-700 focus:border-[#FF5A5A] focus:ring-1 focus:ring-[#FF5A5A] text-white placeholder-gray-500 shadow-sm transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center bg-gradient-to-r from-[#FF5A5A] to-[#5A8EFF] hover:from-[#FF7676] hover:to-[#76A8FF] py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#5A8EFF] transition-all duration-200"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <svg className="mx-auto mb-4 h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¡Contraseña Restablecida!
              </h3>
              <p className="text-gray-400 mb-6">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} TripTap Latam. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
