'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Globe, Wifi, Calendar, DollarSign, 
  ChevronDown, Check, X, MapPin, CreditCard, User, 
  Mail, Phone, Map, Loader, ArrowLeft, Shield, 
  Plane, Signal, Zap, Clock
} from 'lucide-react';

const HeroWithSearch = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dev.triptapmedia.com/api/esim/');
        const data = await response.json();
        
        if (data.data) {
          setPlans(data.data);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    const filtered = plans.filter(plan =>
      plan.title.toLowerCase().includes(query.toLowerCase()) ||
      plan.slug.toLowerCase().includes(query.toLowerCase()) ||
      plan.operators?.some(op => 
        op.title.toLowerCase().includes(query.toLowerCase())
      )
    );

    // Sort: Dominican Republic first
    const sorted = filtered.sort((a, b) => {
      if (a.slug === 'dominican-republic') return -1;
      if (b.slug === 'dominican-republic') return 1;
      return a.title.localeCompare(b.title);
    });

    setSearchResults(sorted);
    setShowSearchResults(true);
  };

  // Handle plan selection from search
  const handlePlanSelect = (plan, operator = null, packageItem = null) => {
    if (operator && packageItem) {
      // Direct selection with specific package
      setSelectedPlan({
        country: plan.title,
        countrySlug: plan.slug,
        operator: operator.title,
        package: packageItem,
        image: plan.image?.url
      });
      setShowCheckoutDialog(true);
    } else {
      // Just show country plans
      setSelectedPlan({
        country: plan.title,
        countrySlug: plan.slug,
        image: plan.image?.url,
        operators: plan.operators
      });
      setShowCheckoutDialog(true);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Handle checkout
  const handleCheckout = async (formData) => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('https://dev.triptapmedia.com/api/esim/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setCheckoutData(data);
      } else {
        console.error('Checkout failed:', data.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Reset checkout
  const resetCheckout = () => {
    setSelectedPlan(null);
    setShowCheckoutDialog(false);
    setCheckoutData(null);
    setCheckoutLoading(false);
  };

  // Stats data
  const stats = [
    { number: '150+', label: 'Countries', icon: '🌍', color: 'from-blue-500 to-cyan-500' },
    { number: '24/7', label: 'Support', icon: '💬', color: 'from-purple-500 to-pink-500' },
    { number: '5G', label: 'Network', icon: '⚡', color: 'from-green-500 to-emerald-500' },
    { number: 'Instant', label: 'Activation', icon: '🚀', color: 'from-orange-500 to-red-500' },
  ];

  const features = [
    { icon: '📱', title: 'Digital eSIM', description: 'No physical SIM card needed' },
    { icon: '⚡', title: 'Instant Setup', description: 'Active in 2 minutes' },
    { icon: '💰', title: 'Best Prices', description: 'Guaranteed lowest rates' },
    { icon: '🌐', title: 'Global Coverage', description: '150+ countries' },
  ];

  // Airplanes animation
  const airplanes = [
    { delay: 0, duration: 25, startX: -100, startY: '15%', endX: '120%', size: 'w-12 h-12' },
    { delay: 5, duration: 30, startX: -100, startY: '35%', endX: '120%', size: 'w-10 h-10' },
    { delay: 12, duration: 28, startX: '120%', startY: '25%', endX: -100, size: 'w-14 h-14' },
  ];

  // Geometric shapes
  const geometricShapes = [
    { 
      type: 'cube', 
      delay: 0, 
      duration: 15, 
      size: 'w-16 h-16', 
      color: 'from-cyan-400/40 to-blue-400/40',
      top: '10%', 
      left: '5%',
      rotation: [0, 180, 360]
    },
    { 
      type: 'pyramid', 
      delay: 3, 
      duration: 18, 
      size: 'w-20 h-20', 
      color: 'from-purple-400/40 to-pink-400/40',
      top: '70%', 
      left: '80%',
      rotation: [0, 90, 180, 270, 360]
    },
  ];

  // Connection particles
  const connectionParticles = [
    { delay: 0, duration: 4, startX: '20%', startY: '40%', endX: '60%', endY: '20%' },
    { delay: 1, duration: 5, startX: '70%', startY: '30%', endX: '40%', endY: '50%' },
    { delay: 2, duration: 6, startX: '30%', startY: '60%', endX: '80%', endY: '40%' },
  ];

  // Airplane Icon Component
  const AirplaneIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16V21L2 16V21L8 14L22 16Z" fill="currentColor" fillOpacity="0.6"/>
      <path d="M22 16L2 11L8 14L22 16Z" fill="currentColor" fillOpacity="0.8"/>
      <path d="M8 14L2 11V3L8 14Z" fill="currentColor" fillOpacity="0.4"/>
      <path d="M22 16L8 14L14 3L22 16Z" fill="currentColor" fillOpacity="0.4"/>
    </svg>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden pt-8">
      {/* Background animations */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 60%, rgba(255, 219, 120, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute inset-0"
        />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Animated elements */}
      {geometricShapes.map((shape, index) => (
        <motion.div
          key={index}
          initial={{ 
            y: 0, 
            x: 0, 
            rotate: 0, 
            scale: 0.8,
            opacity: 0 
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: shape.rotation,
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${shape.size} bg-gradient-to-br ${shape.color} backdrop-blur-sm border border-white/20 shadow-2xl ${
            shape.type === 'cube' ? 'rounded-xl' :
            shape.type === 'pyramid' ? 'clip-pyramid' : 'rounded-full'
          }`}
          style={{
            top: shape.top,
            left: shape.left,
          }}
        />
      ))}

      {/* Connection particles */}
      {connectionParticles.map((particle, index) => (
        <motion.div
          key={index}
          initial={{ 
            x: particle.startX, 
            y: particle.startY,
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            x: particle.endX,
            y: particle.endY,
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm z-10"
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side - Text and features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
              />
              <span className="text-sm font-medium text-white/80">✨ Global eSIM Provider</span>
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                Stay
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                  className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  Connected
                </motion.span>
              </h1>
              
              <p className="text-xl text-white/70 leading-relaxed">
                Instant digital SIM cards for 150+ countries. 
                <br />
                No physical SIM needed. Activate in 2 minutes.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for a country (e.g., Dominican Republic, Spain, USA...)"
                  className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300 text-lg"
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
                  >
                    {searchResults.length === 0 ? (
                      <div className="p-6 text-center text-white/60">
                        No countries found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="p-2">
                        {searchResults.map((plan, index) => (
                          <motion.div
                            key={plan.slug}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handlePlanSelect(plan)}
                            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-300 group"
                          >
                            {plan.image && (
                              <img
                                src={plan.image.url}
                                alt={plan.title}
                                className="w-12 h-9 object-cover rounded-lg border border-white/20"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                                {plan.title}
                              </h3>
                              <p className="text-white/60 text-sm">
                                {plan.operators?.length || 0} operators • From $
                                {plan.operators && plan.operators.length > 0 
                                  ? Math.min(...plan.operators.flatMap(op => op.packages?.map(p => p.price) || [0]))
                                  : 0
                                }
                              </p>
                            </div>
                            <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transform group-hover:rotate-90 transition-all" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                    className="text-2xl mb-2"
                  >
                    {stat.icon}
                  </motion.div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl"
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <div className="text-white font-semibold text-sm">{feature.title}</div>
                    <div className="text-white/50 text-xs">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-2xl">
              {/* Enhanced glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 rounded-[3rem] blur-3xl -z-10"
              />
              
              {/* Enhanced card container */}
              <motion.div
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl border border-white/30"
              >
                {/* Image container with smooth gradient */}
                <div className="relative rounded-[1.5rem] overflow-hidden">
                  <div className="relative">
                    <img
                      src="https://storage.googleapis.com/triptap/Chica.png"
                      alt="Traveler using eSIM"
                      className="w-full h-auto object-cover"
                    />
                    
                    {/* Smooth gradient covering from bottom */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-2/5"
                      style={{
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 20%, rgba(15, 23, 42, 0.4) 40%, transparent 100%)'
                      }}
                    />
                  </div>
                  
                  {/* Enhanced connection effects */}
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-6 right-6 w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                  />
                  
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-5 right-5 w-6 h-6 border-2 border-green-400 rounded-full"
                  />

                  {/* Additional connection signals */}
                  <motion.div
                    animate={{ scale: [0, 1.5], opacity: [0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute top-10 left-10 w-3 h-3 bg-blue-400 rounded-full"
                  />
                  
                  <motion.div
                    animate={{ scale: [0, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                    className="absolute bottom-20 left-1/2 w-2 h-2 bg-purple-400 rounded-full"
                  />
                </div>
              </motion.div>

              {/* 3D decorative elements */}
              <motion.div
                animate={{ 
                  y: [0, -25, 0],
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-6 -left-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl p-4 shadow-2xl border border-white/20"
              >
                <div className="text-white font-bold text-sm">🔥 Popular</div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotateX: [0, 180, 360],
                  scale: [1, 1.15, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 shadow-2xl border border-white/20"
              >
                <div className="text-white font-bold text-sm">💫 New</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <AnimatePresence>
        {showCheckoutDialog && selectedPlan && (
          <CheckoutDialog
            selectedPlan={selectedPlan}
            onClose={resetCheckout}
            onCheckout={handleCheckout}
            loading={checkoutLoading}
            checkoutData={checkoutData}
          />
        )}
      </AnimatePresence>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-20"
        >
          <path
            d="M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z"
            className="fill-white/10"
          />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-white/60 text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Checkout Dialog Component
const CheckoutDialog = ({ selectedPlan, onClose, onCheckout, loading, checkoutData }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    package_id: '',
    email: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });

  // Set default package if operators are available
  useEffect(() => {
    if (selectedPlan.operators && selectedPlan.operators.length > 0) {
      const firstOperator = selectedPlan.operators[0];
      if (firstOperator.packages && firstOperator.packages.length > 0) {
        const firstPackage = firstOperator.packages[0];
        setSelectedPackage({
          operator: firstOperator,
          package: firstPackage
        });
        setFormData(prev => ({
          ...prev,
          package_id: firstPackage.id || ''
        }));
      }
    } else if (selectedPlan.package) {
      // Direct package selection
      setSelectedPackage({
        operator: { title: selectedPlan.operator },
        package: selectedPlan.package
      });
      setFormData(prev => ({
        ...prev,
        package_id: selectedPlan.package.id || ''
      }));
    }
  }, [selectedPlan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPackage) {
      onCheckout({
        ...formData,
        package_id: selectedPackage.package.id || selectedPackage.package.package_id
      });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatData = (bytes) => {
    if (!bytes) return 'Unlimited';
    const gb = bytes / 1024;
    return gb >= 1 ? `${Math.round(gb * 10) / 10} GB` : `${bytes} MB`;
  };

  const formatDuration = (days) => {
    if (days === 1) return '1 Day';
    if (days === 365) return '1 Year';
    return `${days} Days`;
  };

  if (checkoutData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 p-8 max-w-md w-full mx-auto shadow-2xl"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-white/70 mb-6">Your eSIM has been successfully activated</p>
            
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                {selectedPlan.image && (
                  <img
                    src={selectedPlan.image}
                    alt={selectedPlan.country}
                    className="w-12 h-9 object-cover rounded-lg border border-white/20"
                  />
                )}
                <div className="text-left">
                  <h3 className="text-white font-semibold">{selectedPlan.country}</h3>
                  <p className="text-white/60 text-sm">{selectedPlan.operator}</p>
                </div>
              </div>
              
              {selectedPackage && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Data</p>
                    <p className="text-white font-semibold">
                      {formatData(selectedPackage.package.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Duration</p>
                    <p className="text-white font-semibold">
                      {formatDuration(selectedPackage.package.day)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Price</p>
                    <p className="text-cyan-400 font-bold">${selectedPackage.package.price}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Status</p>
                    <p className="text-green-400 font-semibold">Active</p>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold"
            >
              Continue Browsing
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 p-6 max-w-4xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Your Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white/70" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Selected Plan</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                {selectedPlan.image && (
                  <img
                    src={selectedPlan.image}
                    alt={selectedPlan.country}
                    className="w-16 h-12 object-cover rounded-lg border border-white/20"
                  />
                )}
                <div>
                  <h4 className="text-white font-semibold text-lg">{selectedPlan.country}</h4>
                  {selectedPackage && (
                    <p className="text-white/60">{selectedPackage.operator.title}</p>
                  )}
                </div>
              </div>

              {/* Package Selection */}
              {selectedPlan.operators && (
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Available Packages</h4>
                  {selectedPlan.operators.map((operator, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-white/70 text-sm font-medium">{operator.title}</p>
                      {operator.packages?.slice(0, 3).map((pkg, pkgIndex) => (
                        <motion.div
                          key={pkgIndex}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedPackage?.package === pkg 
                              ? 'border-cyan-400 bg-cyan-400/10' 
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          onClick={() => setSelectedPackage({ operator, package: pkg })}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-semibold">
                                {formatData(pkg.amount)}
                              </p>
                              <p className="text-white/60 text-sm">
                                {formatDuration(pkg.day)}
                              </p>
                            </div>
                            <p className="text-cyan-400 font-bold">${pkg.price}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Package Summary */}
              {selectedPackage && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Data:</span>
                      <span className="text-white">{formatData(selectedPackage.package.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Duration:</span>
                      <span className="text-white">{formatDuration(selectedPackage.package.day)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-white/10">
                      <span className="text-white">Total:</span>
                      <span className="text-cyan-400">${selectedPackage.package.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white font-medium mb-3">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white font-medium mb-3">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Payment Information */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <span>Payment Information</span>
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center space-x-2 text-white font-medium mb-3">
                      <span>Card Number</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-white font-medium mb-3">
                        <span>Exp Month</span>
                      </label>
                      <input
                        type="text"
                        name="expirationMonth"
                        value={formData.expirationMonth}
                        onChange={handleChange}
                        placeholder="MM"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-white font-medium mb-3">
                        <span>Exp Year</span>
                      </label>
                      <input
                        type="text"
                        name="expirationYear"
                        value={formData.expirationYear}
                        onChange={handleChange}
                        placeholder="YYYY"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-white font-medium mb-3">
                        <span>CVV</span>
                      </label>
                      <input
                        type="text"
                        name="securityCode"
                        value={formData.securityCode}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-3 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
                <Shield className="w-5 h-5 text-cyan-400" />
                <p className="text-cyan-400 text-sm">
                  Your payment information is secure and encrypted. We never store your card details.
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !selectedPackage}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>
                      Complete Purchase - 
                      {selectedPackage ? ` $${selectedPackage.package.price}` : ''}
                    </span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroWithSearch;