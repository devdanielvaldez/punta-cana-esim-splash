import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Head from 'next/head';

export default function Home() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica de email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulación de envío con delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulación exitosa
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Reset después de 3 segundos
    setTimeout(() => {
      setIsSuccess(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <Head>
        <title>PuntaCana Esim</title>
      </Head>
      {/* Left side - Imagen de fondo */}
      <div className="relative flex-1 bg-gradient-to-br from-[#180081] via-[#2f009b] to-[#3a00a8] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-left"
          style={{ backgroundImage: "url('images/person.png')", backgroundPosition: "left center" }}
        />
        <div className="absolute inset-0 bg-black/5"></div>
        <img
          src="images/logo.png"
          alt="Logo Punta Cana eSIM"
          className="absolute top-6 right-6 w-40 z-10 animate-fade-in"
        />
        <p className="absolute bottom-4 right-6 text-white text-xs opacity-75 z-10">
          ©2025 eSIM Punta Cana
        </p>
      </div>

      {/* Right side - Contenido */}
      <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col justify-center items-center p-8">
        <div className={`max-w-lg w-full transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          
          {/* Estado de éxito */}
          {isSuccess ? (
            <div className="text-center animate-success-pop">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-success-scale">
                    <FiCheck className="text-white text-3xl animate-check-draw" />
                  </div>
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping-slow opacity-30"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-green-400 animate-fade-in-up">
                Thank You!
              </h2>
              <p className="text-lg text-gray-300 mb-2 animate-fade-in-up animation-delay-200">
                We've received your email
              </p>
              <p className="text-gray-400 animate-fade-in-up animation-delay-400">
                We'll notify you as soon as we launch
              </p>
            </div>
          ) : (
            <>
              {/* Título principal con animación */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-gradient-x">
                Get Ready for a New Way to Connect in Punta Cana!
              </h1>
              
              {/* Descripción */}
              <p className="text-lg text-gray-300 mb-10 text-center leading-relaxed animate-fade-in-up animation-delay-200">
                We're working hard to bring you a seamless way to stay connected on
                your next trip. Our Punta Cana eSIM service will let you get instant
                mobile data without the hassle of physical SIM cards or expensive
                roaming fees.
              </p>

              {/* Features con animaciones escalonadas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                {[
                  { 
                    icon: "images/instant.png", 
                    title: "Instant activation", 
                    desc: "no more searching for a store" 
                  },
                  { 
                    icon: "images/reliable.png", 
                    title: "Reliable, fast data", 
                    desc: "share your vacation photos and stay in touch" 
                  },
                  { 
                    icon: "images/simple.png", 
                    title: "Simple setup", 
                    desc: "just a quick scan and you're good to go" 
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center text-center group animate-fade-in-up"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="w-14 h-14 mb-4 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <img 
                        src={feature.icon} 
                        alt={feature.title} 
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <p className="font-semibold mb-1 text-white group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </p>
                    <p className="text-gray-400 text-xs leading-tight">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Email form moderno */}
              <form 
                onSubmit={handleSubmit} 
                className="flex flex-col sm:flex-row gap-3 mb-4 animate-fade-in-up animation-delay-700"
              >
                <div className="flex-1 relative group">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    disabled={isSubmitting}
                    className="w-full p-4 pl-6 rounded-2xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-gray-700/70 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="p-4 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <span>Send</span>
                      <FiSend className="group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Mensaje de error */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 mb-4 animate-shake">
                  <FiAlertCircle />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Texto final */}
              <p className="italic text-gray-400 text-center animate-fade-in-up animation-delay-800">
                Stay tuned! We'll be live very soon.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Estilos para animaciones personalizadas */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-success-pop {
          animation: success-pop 0.8s ease-out forwards;
        }

        @keyframes success-scale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-success-scale {
          animation: success-scale 0.6s ease-out forwards;
        }

        @keyframes check-draw {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1);
          }
        }
        .animate-check-draw {
          animation: check-draw 0.8s ease-out forwards;
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </div>
  );
}