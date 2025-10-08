import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp, FiTag, FiMessageCircle, FiSend, FiX, FiUser, FiInfo } from 'react-icons/fi';

// Interfaces para el chat
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

export default function Receipt({ transactionData }: any) {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);
  const [isPrinting, setIsPrinting] = useState<any>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para descuentos
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [showDiscounts, setShowDiscounts] = useState<boolean>(false);
  const [loadingDiscounts, setLoadingDiscounts] = useState<boolean>(false);

  // Estados para el chat de reclamaciones
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [userLanguage, setUserLanguage] = useState<string>('es');
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  const [claimInfo, setClaimInfo] = useState<ClaimInfo>({
    claimType: '',
    tripId: '',
    passengerName: ''
  });
  
  // Para scrollear automáticamente al último mensaje
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // API base URL para el chat
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

  // Load data based on props, id or from API
  useEffect(() => {
    const fetchReceipt = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.triptapmedia.com/api/transaction/receipts/${id}`);
        console.log(response.data.data);
        setData(response.data.data);
      } catch (err: any) {
        console.error('Error fetching receipt:', err);
        setError(err.response?.data?.message || 'Error loading receipt');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceipt();
  }, [transactionData, id]);

  // Scroll al último mensaje cuando se añadan nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to fetch discounts applied to this transaction
  const fetchDiscounts = async () => {
    if (!id || loadingDiscounts) return;
    
    setLoadingDiscounts(true);
    try {
      // Replace with your actual API endpoint to get discounts for a transaction
      const response = await axios.get(`https://api.triptapmedia.com/api/discounts/`);
      setDiscounts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      // If API is not available, show sample data for demonstration
      setDiscounts([
        {
          _id: '12345',
          code: 'WELCOME20',
          establishmentName: 'TripTap',
          format: 'PERCENTAGE',
          value: 20,
          description: 'Welcome discount for new customers',
          amountSaved: 15.00
        },
        {
          _id: '67890',
          code: 'LOYALTY10',
          establishmentName: 'TripTap Rewards',
          format: 'FIXED_AMOUNT',
          value: 10,
          description: 'Loyalty program discount',
          amountSaved: 10.00
        }
      ]);
    } finally {
      setLoadingDiscounts(false);
    }
  };

  // Toggle discount visibility and fetch data if needed
  const toggleDiscounts = () => {
    if (!showDiscounts && discounts.length === 0) {
      fetchDiscounts();
    }
    setShowDiscounts(!showDiscounts);
  };

  // Format date
  const formatDate = (dateString: any) => {
    if (!dateString) return '';
    return moment(dateString).locale('en').format('llll');
  };

  // Format amount
  const formatAmount = (amount: any) => {
    return parseFloat(amount).toFixed(2);
  };

  // Print function
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // CHAT FUNCTIONS
  // Iniciar una nueva conversación
  const startConversation = async (initialMessage: string): Promise<void> => {
    setIsLoadingChat(true);
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
      setIsLoadingChat(false);
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
    setIsLoadingChat(true);
    
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
      setIsLoadingChat(false);
    }
  };

  // Finalizar la reclamación
  const finalizeClaim = async (): Promise<void> => {
    if (!claimId) return;
    
    setIsLoadingChat(true);
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
      setIsLoadingChat(false);
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
    if (!isLoadingChat && inputMessage.trim()) {
      sendMessage(inputMessage);
    }
  };

  // Formatear timestamp para mostrar
  const formatTime = (timestamp: Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12 print:bg-white print:p-0">
      {/* Decorative particles (only visible on screen, not for printing) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EF5AFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4EBEFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#6A7FFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Receipt */}
      <div className="w-full max-w-md relative z-10 print:max-w-full print:w-full">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700 p-8 print:bg-white print:shadow-none print:border-0 print:p-4 print:text-black">
          {/* Print button (only visible on screen) */}
          <div className="flex justify-between mb-4 print:hidden">
            <button 
              onClick={() => setIsOpenChat(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] hover:from-[#7C8FFF] hover:to-[#FF6AFF] rounded-lg text-white text-sm font-medium transition-all duration-200"
            >
              <FiMessageCircle className="h-5 w-5 mr-1" />
              Need Help?
            </button>
            
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#EF5AFF] to-[#4EBEFF] hover:from-[#ff7cff] hover:to-[#75cfff] rounded-lg text-white text-sm font-medium transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
          </div>
          
          {/* Logo and title */}
          <div className="text-center mb-6">
            <div className="inline-block">
              <div className="flex justify-center mb-2">
                <div className="h-16 w-16 flex items-center justify-center print:text-black">
                  <img src="/images/logo.png" alt="Logo" className="w-[80px] h-[20px]" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 print:text-black">Payment Receipt</h1>
            <p className="text-gray-400 print:text-gray-700">Successful Transaction</p>
          </div>
          
          {/* Main transaction information */}
          <div className="bg-gradient-to-r from-[#EF5AFF]/10 to-[#4EBEFF]/10 rounded-xl p-5 mb-6 print:bg-gray-100 print:border print:border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-400 text-sm print:text-gray-600">Date</p>
                <p className="text-white text-md font-medium print:text-black">{formatDate(data?.date)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm print:text-gray-600">Amount</p>
                <p className="text-white text-xl font-bold print:text-black">DOP {formatAmount(data?.amount)}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm print:text-gray-600">Status</p>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  <p className="text-green-400 text-md font-medium print:text-green-600">{data?.state === 'Aprobado' ? 'Approved' : data?.state}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm print:text-gray-600">Method</p>
                <p className="text-white text-md font-medium print:text-black">{data?.method === 'Tarjeta' ? 'Card' : data?.method}</p>
              </div>
            </div>
          </div>
          
          {/* Currency conversion disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6 print:bg-yellow-50 print:border-yellow-200">
            <p className="text-yellow-400 text-xs print:text-yellow-800 font-medium">
              DISCLAIMER: The amount shown in USD on the tablet is only a reference to what will be charged in the local currency.
            </p>
          </div>
          
          {/* Transaction details */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-2 border-b border-gray-700 pb-2 print:text-black print:border-gray-300">Transaction Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs print:text-gray-600">Host Name</p>
                  <p className="text-white text-sm font-medium print:text-black">{data?.hostname}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs print:text-gray-600">Batch</p>
                  <p className="text-white text-sm font-medium print:text-black">{data?.lote}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs print:text-gray-600">Receipt No.</p>
                  <p className="text-white text-sm font-medium print:text-black">{data?.receiptNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs print:text-gray-600">Approval No.</p>
                  <p className="text-white text-sm font-medium print:text-black">{data?.aproveNumber}</p>
                </div>
              </div>
              
              {/* Column 2 */}
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs print:text-gray-600">Terminal ID</p>
                  <p className="text-white text-sm font-medium print:text-black">{data?.terminalId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs print:text-gray-600">SDK Version</p>
                  <p className="text-white text-sm font-medium print:text-black">PortalSdk 1.0.24</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* DISCOUNTS SECTION - NEW */}
          <div className="mb-6">
            <button 
              onClick={toggleDiscounts}
              className="w-full flex items-center justify-between bg-gradient-to-r from-[#6A7FFF]/20 to-[#EF5AFF]/20 text-white py-3 px-4 rounded-lg hover:from-[#6A7FFF]/30 hover:to-[#EF5AFF]/30 transition-all duration-200 print:bg-gray-100 print:text-black print:border print:border-gray-200"
            >
              <div className="flex items-center">
                <FiTag className="h-5 w-5 mr-2 text-[#EF5AFF]" />
                <span className="font-medium">TripTap Coupons</span>
              </div>
              {showDiscounts ? 
                <FiChevronUp className="h-5 w-5" /> : 
                <FiChevronDown className="h-5 w-5" />
              }
            </button>
            
            {showDiscounts && (
              <div className="mt-4 bg-gradient-to-r from-[#6A7FFF]/10 to-[#EF5AFF]/10 rounded-xl p-4 border border-[#6A7FFF]/20 print:bg-gray-50 print:border-gray-200">
                {loadingDiscounts ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#EF5AFF]"></div>
                  </div>
                ) : discounts.length > 0 ? (
                  <div className="space-y-3">
                    {discounts.map((discount) => (
                      <div key={discount._id} className="border-b border-gray-700 pb-3 last:border-0 print:border-gray-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="bg-[#EF5AFF]/20 text-[#EF5AFF] text-xs px-2 py-0.5 rounded mr-2 print:bg-pink-100 print:text-pink-800">
                                {discount.code}
                              </span>
                              <p className="text-white text-sm font-medium print:text-black">
                                {discount.establishmentName}
                              </p>
                            </div>
                            <p className="text-gray-400 text-xs mt-1 print:text-gray-600">
                              {discount.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm font-bold print:text-black">
                              {discount.format === 'PERCENTAGE' ? 
                                `${discount.value}%` : 
                                `DOP ${formatAmount(discount.value)}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-2 print:text-gray-600">
                    No discounts were applied to this transaction.
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Signature (only visible in print mode) */}
          <div className="hidden print:block">
            <div className="mt-10 pt-5 border-t border-gray-300">
              <p className="text-center text-gray-600 text-sm">Customer Signature</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-700 pt-5 print:border-gray-300">
            <p className="text-sm text-gray-400 print:text-gray-600">Powered by PORTAL</p>
            <p className="mt-2 text-xs text-gray-500 print:text-gray-500">This document serves as proof of payment.</p>
          </div>
        </div>
        
        {/* Footer below receipt */}
        <div className="mt-8 text-center text-xs text-gray-500 print:hidden">
          <p>© {new Date().getFullYear()} TripTap. All rights reserved.</p>
        </div>
      </div>

      {/* Botón flotante para abrir el chat (solo visible cuando el chat está cerrado) */}
      {!isOpenChat && (
        <button
          onClick={() => setIsOpenChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center print:hidden"
        >
          <FiMessageCircle className="h-6 w-6" />
          <span className="ml-2 font-medium">Need Help?</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpenChat && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 bg-gray-800 rounded-t-xl md:rounded-xl shadow-2xl border border-gray-700 flex flex-col z-50 transition-all duration-300 max-h-[80vh] print:hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-3">
                <FiMessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">TripTap Assistant</h3>
                <p className="text-xs text-white/80">Tell us about your trip</p>
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
                onClick={() => setIsOpenChat(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
              >
                <FiX className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                <div className="bg-[#6A7FFF]/20 p-4 rounded-full mb-4">
                  <FiInfo className="h-8 w-8 text-[#6A7FFF]" />
                </div>
                <h4 className="text-white font-bold mb-2">How can we help you?</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Tell us about any issues you had during your trip with TripTap.
                </p>
                <div className="w-full space-y-2">
                  {[
                    "I had a problem with the payment",
                    "The taxi screen wasn't working",
                    "I want to report an issue with my ride"
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
                {/* Conversación */}
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
                            {msg.sender === 'user' ? 'You' : 'Assistant'}
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
          
          {/* Input form for sending messages */}
          <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                disabled={isLoadingChat}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A7FFF]"
              />
              <button
                type="submit"
                disabled={isLoadingChat || !inputMessage.trim()}
                className={`bg-gradient-to-r from-[#6A7FFF] to-[#EF5AFF] text-white rounded-r-lg px-4 flex items-center justify-center ${
                  isLoadingChat || !inputMessage.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-[#7C8FFF] hover:to-[#FF6AFF]'
                }`}
              >
                {isLoadingChat ? (
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
                Submit Claim
              </button>
            )}
          </form>
          
          {/* Chat Footer */}
          <div className="bg-gray-900 px-4 py-2 text-xs text-gray-500 rounded-b-xl text-center">
            Powered by TripTap AI Assistant
          </div>
        </div>
      )}
    </div>
  );
}