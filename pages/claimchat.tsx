import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiX, FiMessageCircle, FiUser, FiInfo } from 'react-icons/fi';

// Interfaces para TypeScript
interface Message {
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ClaimInfo {
  claimType: string;
  tripId: string;
  passengerName: string;
}

interface Language {
  code: string;
  name: string;
}

export default function ClaimChat(): JSX.Element {
  // Estados para el chat
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [userLanguage, setUserLanguage] = useState<string>('es');
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  
  // Información sobre la reclamación
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>({
    claimType: '',
    tripId: '',
    passengerName: ''
  });
  
  // Para hacer scroll automático al último mensaje
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API base URL
  const API_BASE_URL: string = 'http://localhost:3131/api';
  
  // Idiomas disponibles
  const languages: Language[] = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' }
  ];

  // Scroll al último mensaje cuando se añadan nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Iniciar una nueva conversación
  const startConversation = async (initialMessage: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/claim-ai/chat/start`, {
        initialMessage,
        language: userLanguage
      });

      setClaimId(response.data.claimId);
      setMessages(response.data.conversation);
      
      // Si hay información de reclamación disponible, actualizar el estado
      if (response.data.claimInfo) {
        setClaimInfo(response.data.claimInfo);
      }

    } catch (error) {
      console.error('Error starting conversation:', error);
      setMessages([
        { 
          sender: 'ai', 
          content: 'Lo siento, tuvimos un problema al iniciar la conversación. Por favor, intenta de nuevo.', 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar mensaje a la conversación existente
  const sendMessage = async (message: string): Promise<void> => {
    if (!message.trim()) return;
    
    // Añadir mensaje del usuario a la UI inmediatamente
    const userMessage: Message = {
      sender: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      if (!claimId) {
        // Si no hay conversación activa, iniciarla
        await startConversation(message);
      } else {
        // Continuar conversación existente
        const response = await axios.post(`${API_BASE_URL}/claim-ai/chat/${claimId}/message`, {
          message
        });

        // Añadir respuesta de la IA
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'ai',
            content: response.data.response,
            timestamp: new Date()
          }
        ]);

        // Actualizar información de la reclamación si está disponible
        if (response.data.claimInfo) {
          setClaimInfo(response.data.claimInfo);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'ai',
          content: 'Lo siento, hubo un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Finalizar la reclamación
  const finalizeClaim = async (): Promise<void> => {
    if (!claimId) return;
    
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/claim-ai/chat/${claimId}/finalize`, {
        ...claimInfo,
        status: 'en_proceso'
      });
      
      // Mensaje de despedida
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'ai',
          content: '¡Gracias por tu reclamación! Ha sido registrada correctamente. Un representante la revisará pronto.',
          timestamp: new Date()
        }
      ]);
      
      // Reiniciar después de unos segundos
      setTimeout(() => {
        setClaimId(null);
        setMessages([]);
        setClaimInfo({
          claimType: '',
          tripId: '',
          passengerName: ''
        });
      }, 5000);
      
    } catch (error) {
      console.error('Error finalizing claim:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'ai',
          content: 'Lo siento, hubo un problema al finalizar tu reclamación. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar idioma
  const changeLanguage = (langCode: string): void => {
    setUserLanguage(langCode);
    setShowLanguageSelector(false);
    // Si ya hay mensajes, informar sobre el cambio de idioma
    if (messages.length > 0) {
      sendMessage(`Quiero continuar en ${languages.find(l => l.code === langCode)?.name}`);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isLoading && inputMessage.trim()) {
      sendMessage(inputMessage);
    }
  };

  // Formatear timestamp para mostrar
  const formatTime = (timestamp: Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center"
        >
          <FiMessageCircle className="h-6 w-6" />
          <span className="ml-2 font-medium">Ayuda</span>
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 bg-gray-800 rounded-t-xl md:rounded-xl shadow-2xl border border-gray-700 flex flex-col z-50 transition-all duration-300 max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-3">
                <FiMessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">TripTap Asistente</h3>
                <p className="text-xs text-white/80">Háblanos sobre tu viaje</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Selector de idioma */}
              <div className="relative mr-2">
                <button 
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                >
                  <span className="text-white text-xs font-bold">{userLanguage.toUpperCase()}</span>
                </button>
                
                {showLanguageSelector && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-700 text-sm ${
                          lang.code === userLanguage ? 'bg-gray-700 text-white' : 'text-gray-300'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Botón cerrar */}
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
              >
                <FiX className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Mensajes */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                <div className="bg-[#6A7FFF]/20 p-4 rounded-full mb-4">
                  <FiInfo className="h-8 w-8 text-[#6A7FFF]" />
                </div>
                <h4 className="text-white font-bold mb-2">¿Cómo podemos ayudarte?</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Cuéntanos sobre cualquier problema que hayas tenido durante tu viaje con TripTap.
                </p>
                <div className="w-full space-y-2">
                  {[
                    "Tuve un problema con el pago",
                    "La pantalla del taxi no funcionaba",
                    "Quiero reportar un problema con mi viaje"
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(suggestion)}
                      className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Mensajes de la conversación */}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <div className="flex items-center">
                          {msg.sender === 'user' ? (
                            <FiUser className="h-3 w-3 mr-1" />
                          ) : (
                            <FiMessageCircle className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-xs opacity-75">
                            {msg.sender === 'user' ? 'Tú' : 'Asistente'}
                          </span>
                        </div>
                        <span className="ml-2 text-xs opacity-50">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input para enviar mensaje */}
          <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A7FFF]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] text-white rounded-r-lg px-4 flex items-center justify-center ${
                  isLoading || !inputMessage.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-[#7C8FFF] hover:to-[#FF6AFF]'
                }`}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <FiSend className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Botón para finalizar reclamo */}
            {claimId && messages.length > 4 && (
              <button
                onClick={finalizeClaim}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              >
                Finalizar y enviar reclamo
              </button>
            )}
          </form>
          
          {/* Footer */}
          <div className="bg-gray-900 px-4 py-2 text-xs text-gray-500 rounded-b-xl text-center">
            Powered by TripTap AI Assistant
          </div>
        </div>
      )}
    </>
  );
}