'use client';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useRef, useEffect, useState } from 'react';
import { Check, Star, Zap, Shield, Globe2, Clock, Users, Award, Sparkles, Wifi, Phone, MessageCircle, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Hook personalizado para efectos 3D
const use3DEffect = (intensity = 10) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-1, 1], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-1, 1], [-intensity, intensity]), springConfig);
  
  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  
  const onMouseLeave = () => {
    animate(x, 0, { duration: 0.5 });
    animate(y, 0, { duration: 0.5 });
  };

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
};

// Componente de Partículas 3D
const ParticleField = ({ count = 50 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400/40 to-blue-400/40"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Sección de Planes con Datos Reales
export const RealPlansSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleViewAllPlans = () => {
    router.push('/plans');
  };

  const handleBuyNow = (plan, pkg) => {
    // Navegar a la página principal con el plan pre-seleccionado
    router.push(`/?country=${plan.slug}&package=${pkg.id}`);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://dev.triptapmedia.com/api/esim/');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Buscar específicamente Dominican Republic
          const dominicanRepublic = data.data.find(country => 
            country.slug === 'dominican-republic'
          );

          if (dominicanRepublic) {
            // Obtener todos los paquetes de tipo 'sim' de todos los operadores
            const allPackages = [];
            dominicanRepublic.operators?.forEach(operator => {
              if (operator.packages && operator.packages.length > 0) {
                operator.packages.forEach(pkg => {
                  if (pkg.type === 'sim') {
                    allPackages.push({
                      operator: operator.title,
                      ...pkg
                    });
                  }
                });
              }
            });

            // Ordenar paquetes por precio y tomar los 3 mejores
            const bestPackages = allPackages
              .sort((a, b) => a.price - b.price)
              .slice(0, 3);

            // Crear planes destacados con los mejores paquetes
            const featuredPlan = {
              id: dominicanRepublic.slug,
              name: dominicanRepublic.title,
              description: 'The perfect eSIM for your Caribbean adventure',
              image: dominicanRepublic.image?.url,
              packages: bestPackages,
              popular: true,
              color: "from-amber-500 to-orange-500",
              features: [
                '5G/LTE Coverage Nationwide',
                'Instant Digital Activation',
                'Unlimited Social Media',
                'Local Number Included',
                '24/7 Customer Support'
              ],
              slug: dominicanRepublic.slug
            };
            
            setPlans([featuredPlan]);
          }
        }
      } catch (err) {
        setError('Failed to load plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-8"
            />
            <p className="text-white text-xl">Loading Dominican Republic plans...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-400">
            <p className="text-xl">{error}</p>
          </div>
        </div>
      </section>
    );
  }


};

// Componente de Órbitas Flotantes
const FloatingOrbits = () => {
  return (
    <>
      {[1, 2, 3].map((orbit) => (
        <motion.div
          key={orbit}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20 + orbit * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute border border-cyan-400/20 rounded-full"
          style={{
            width: `${300 + orbit * 200}px`,
            height: `${300 + orbit * 200}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  );
};

// Tarjeta de Plan Real
const RealPlanCard = ({ plan, index, onBuyNow }) => {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = use3DEffect(12);
  const [isHovered, setIsHovered] = useState(false);

  // Función para formatear los datos
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.3, type: "spring" }}
      className="relative lg:col-span-3" // Ocupa todo el ancho en lg
    >
      {/* Popular Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-2xl flex items-center space-x-3"
        >
          <Sparkles className="w-5 h-5" />
          <span>🔥 TOP CHOICE FOR DOMINICAN REPUBLIC</span>
        </motion.div>
      </motion.div>

      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={() => {
          onMouseLeave();
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border-2 p-8 shadow-2xl transition-all duration-500 h-full border-amber-400/60 shadow-amber-500/30"
      >
        {/* Efecto de Energía */}
        <motion.div
          animate={isHovered ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl opacity-30 blur-xl -z-10"
        />

        {/* Header del Plan */}
        <div className="text-center mb-8" style={{ transform: "translateZ(30px)" }}>
          {plan.image && (
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              src={plan.image}
              alt={plan.name}
              className="w-20 h-16 object-cover rounded-lg mx-auto mb-4 border border-white/20"
            />
          )}
          <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-amber-300 text-lg font-semibold">🏝️ Caribbean Paradise eSIM</p>
          <p className="text-white/70 text-sm mt-2">{plan.description}</p>
        </div>

        {/* Paquetes Disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ transform: "translateZ(20px)" }}>
          <h4 className="text-white font-semibold text-center mb-4 md:col-span-3 text-xl">
            🎯 Best eSIM Packages
          </h4>
          {plan.packages?.map((pkg, pkgIndex) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + pkgIndex * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 transition-all duration-300 relative group"
            >
              {/* Badge de Recomendado para el primer paquete */}
              {pkgIndex === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ MOST POPULAR
                  </div>
                </motion.div>
              )}

              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-amber-400 mb-2">
                  ${pkg.price}
                </div>
                <div className="text-white font-semibold text-lg">
                  {formatData(pkg.amount)}
                </div>
                <div className="text-white/60 text-sm">
                  {formatDuration(pkg.day)}
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="text-amber-300">5G/LTE</span>
                </div>
                <div className="flex justify-between">
                  <span>Activation:</span>
                  <span className="text-green-400">Instant</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="text-cyan-400">eSIM</span>
                </div>
              </div>

              {/* Botón de compra */}
              <motion.button
                onClick={() => onBuyNow(plan, pkg)}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(251, 191, 36, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 py-3 bg-amber-500/20 border border-amber-400/50 text-amber-300 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-amber-500/30"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Buy Now</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Características */}
        <div className="space-y-3 mb-8" style={{ transform: "translateZ(20px)" }}>
          <h4 className="text-white font-semibold text-center text-xl mb-6">
            ✨ Why Choose This eSIM?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.features.map((feature, featureIndex) => (
              <motion.div
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + featureIndex * 0.1 }}
                className="flex items-center space-x-3 bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white/80 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Llamada a la acción final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
          style={{ transform: "translateZ(30px)" }}
        >
          <p className="text-white/70 text-sm mb-4">
            🎉 Over 10,000 travelers connected in Dominican Republic
          </p>
          <motion.button
            onClick={() => plan.packages?.[0] && onBuyNow(plan, plan.packages[0])}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300"
          >
            🚀 Get Connected in 2 Minutes
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Sección de Beneficios Actualizada
export const BenefitsSection3D = () => {
  const benefits = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Instant Activation",
      description: "Get connected in under 2 minutes with digital eSIM technology",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Globe2 className="w-12 h-12" />,
      title: "Global Coverage",
      description: "150+ countries with seamless network switching",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Secure Connection",
      description: "Reliable and secure mobile data wherever you travel",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Flexible Plans",
      description: "From 1 day to 1 year - choose what fits your trip",
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl lg:text-7xl font-bold text-white mb-6">
            Why Choose <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Our eSIM</span>?
          </h2>
          <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Experience seamless connectivity with our advanced eSIM technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <HolographicCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Tarjeta Holográfica 3D
const HolographicCard = ({ benefit, index }) => {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = use3DEffect(8);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
      whileHover={{ y: -10 }}
      className="relative group perspective-1000"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={() => {
          onMouseLeave();
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl transition-all duration-500 h-full"
      >
        {/* Holographic Effect */}
        <motion.div
          animate={isHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 rounded-3xl"
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-white shadow-2xl mb-6 mx-auto`}
          >
            {benefit.icon}
          </motion.div>

          <h3 className="text-2xl font-bold text-white text-center mb-4">
            {benefit.title}
          </h3>
          
          <p className="text-white/70 text-center text-lg leading-relaxed">
            {benefit.description}
          </p>

          {/* Animated Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            style={{ padding: '2px' }}
          >
            <div className="w-full h-full bg-slate-900 rounded-3xl"></div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Sección de Testimonios Actualizada
export const TestimonialsSection3D = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      image: "👩‍💼",
      rating: 5,
      comment: "Used the eSIM across Europe and Asia. Perfect coverage everywhere I went!",
      country: "Multiple Countries"
    },
    {
      name: "Mike Chen",
      role: "Digital Nomad",
      image: "👨‍💻",
      rating: 5,
      comment: "Switched between 5 countries without any issues. The activation was instant!",
      country: "Southeast Asia"
    },
    {
      name: "Emma Rodriguez",
      role: "Tourist",
      image: "👩‍🎒",
      rating: 5,
      comment: "So much better than local SIM cards. No more searching for stores upon arrival!",
      country: "South America"
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Loved by <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Travelers</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join thousands of satisfied customers who stay connected with our eSIM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Tarjeta de Testimonio con Efecto 3D
const TestimonialCard = ({ testimonial, index }) => {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = use3DEffect(6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
      className="relative group"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl transition-all duration-500 h-full"
      >
        {/* Rating Stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.3 }}
          className="flex justify-center mb-6"
          style={{ transform: "translateZ(30px)" }}
        >
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.5, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Star className="w-6 h-6 text-yellow-400 fill-current mx-1" />
            </motion.div>
          ))}
        </motion.div>

        {/* Comment */}
        <motion.p
          className="text-white/80 text-lg leading-relaxed text-center mb-8"
          style={{ transform: "translateZ(40px)" }}
        >
          "{testimonial.comment}"
        </motion.p>

        {/* User Info */}
        <div className="text-center" style={{ transform: "translateZ(50px)" }}>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="text-4xl mb-4"
          >
            {testimonial.image}
          </motion.div>
          <div className="text-white font-bold text-xl mb-2">{testimonial.name}</div>
          <div className="text-cyan-400 text-sm mb-1">{testimonial.role}</div>
          <div className="text-white/60 text-sm">📍 {testimonial.country}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// CTA Final Actualizado
export const FinalCTASection3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleViewAllPlans = () => {
    router.push('/plans');
  };

  const handleGetDominicanESIM = () => {
    router.push('/plans');
  };

  return (
    <section className="relative py-40 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white">
            Ready for Dominican
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
            >
              Republic?
            </motion.span>
          </h2>

          <p className="text-xl lg:text-2xl text-white/70 leading-relaxed">
            Get your eSIM now and enjoy seamless connectivity in the Caribbean paradise
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <motion.button
              onClick={handleGetDominicanESIM}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ 
                scale: 1.1,
                y: -5,
                boxShadow: "0 0 50px rgba(245, 158, 11, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Energy Effect */}
              <motion.div
                animate={isHovered ? { scale: [1, 2, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl"
              />
              
              <span className="relative z-10 flex items-center space-x-3">
                <span>Get Dominican Republic eSIM</span>
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏝️
                </motion.span>
              </span>
            </motion.button>

            {/* <motion.button
              onClick={handleViewAllPlans}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-semibold border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              View All Countries
            </motion.button> */}
          </div>

          {/* Guarantee Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            {[
              { icon: "⚡", text: "Instant Activation" },
              { icon: "💰", text: "Best Prices" },
              { icon: "🛡️", text: "Secure" },
              // { icon: "🏝️", text: "Dominican Republic" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
              >
                <span>{item.icon}</span>
                <span className="text-white/80 text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};