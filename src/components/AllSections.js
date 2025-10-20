'use client';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useRef, useEffect, useState } from 'react';
import { Check, Star, Zap, Shield, Globe2, Clock, Users, Award, Sparkles, Wifi, Phone, MessageCircle } from 'lucide-react';
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
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://dev.triptapmedia.com/api/esim/');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Tomar los primeros 3 operadores para mostrar como planes destacados
          const featuredOperators = data.data.slice(0, 3).map((operator, index) => {
            // Encontrar el paquete más popular (mayor data o mejor precio)
            const packages = operator.operators?.[0]?.packages || [];
            const bestPackage = packages.reduce((best, current) => {
              if (!best) return current;
              // Priorizar paquetes con más data o mejor relación precio/valor
              const currentValue = current.amount / current.price;
              const bestValue = best.amount / best.price;
              return currentValue > bestValue ? current : best;
            }, null);

            return {
              id: operator.slug,
              name: operator.title,
              operator: operator.operators?.[0]?.title || 'Premium eSIM',
              description: operator.operators?.[0]?.info?.[0] || 'High-speed data eSIM',
              image: operator.image?.url,
              packages: packages.slice(0, 3), // Mostrar solo 3 paquetes por plan
              popular: index === 1, // Hacer el del medio popular
              color: index === 0 ? "from-blue-500 to-cyan-500" : 
                     index === 1 ? "from-purple-500 to-pink-500" : 
                     "from-orange-500 to-red-500",
              features: [
                `Coverage: ${operator.title}`,
                operator.operators?.[0]?.coverages?.[0]?.networks?.map(n => n.name).join(', ') || '5G Networks',
                operator.operators?.[0]?.activation_policy === 'first-usage' ? 'Instant Activation' : 'Easy Setup',
                operator.operators?.[0]?.rechargeability ? 'Rechargeable' : 'One-time Use'
              ]
            };
          });
          
          setPlans(featuredOperators);
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
            <p className="text-white text-xl">Loading available plans...</p>
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

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0">
        <FloatingOrbits />
        {/* <ParticleField count={20} /> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl lg:text-7xl font-bold text-white mb-6">
            Available <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Plans</span>
          </h2>
          <p className="text-2xl text-white/70 max-w-2xl mx-auto">
            Choose from our wide selection of eSIM plans for global connectivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <RealPlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Ver todos los planes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
          onClick={handleViewAllPlans}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-semibold border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            View All 150+ Countries
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
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
const RealPlanCard = ({ plan, index }) => {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = use3DEffect(12);
  const [isHovered, setIsHovered] = useState(false);

  // Función para formatear los datos
  const formatData = (bytes) => {
    if (!bytes) return 'Unlimited';
    const gb = bytes / 1024;
    return gb >= 1 ? `${gb} GB` : `${bytes} MB`;
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
      className={`relative ${plan.popular ? 'lg:scale-110 z-20' : ''}`}
    >
      {/* Popular Badge */}
      {plan.popular && (
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-2xl flex items-center space-x-3"
          >
            <Sparkles className="w-5 h-5" />
            <span>MOST POPULAR</span>
          </motion.div>
        </motion.div>
      )}

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
        className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl border-2 p-8 shadow-2xl transition-all duration-500 h-full ${
          plan.popular 
            ? 'border-purple-400/60 shadow-purple-500/30' 
            : 'border-white/20'
        }`}
      >
        {/* Efecto de Energía */}
        <motion.div
          animate={isHovered ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 bg-gradient-to-r ${plan.color} rounded-3xl opacity-30 blur-xl -z-10`}
        />

        {/* Header del Plan */}
        <div className="text-center mb-8" style={{ transform: "translateZ(30px)" }}>
          {plan.image && (
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              src={plan.image}
              alt={plan.name}
              className="w-16 h-12 object-cover rounded-lg mx-auto mb-4 border border-white/20"
            />
          )}
          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-white/60 text-sm">{plan.operator}</p>
          <p className="text-white/70 text-sm mt-2">{plan.description}</p>
        </div>

        {/* Paquetes Disponibles */}
        <div className="space-y-4 mb-8" style={{ transform: "translateZ(20px)" }}>
          <h4 className="text-white font-semibold text-center mb-4">Available Packages</h4>
          {plan.packages?.slice(0, 3).map((pkg, pkgIndex) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + pkgIndex * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">
                  {formatData(pkg.amount)}
                </span>
                <span className="text-cyan-400 font-bold">
                  ${pkg.price}
                </span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>{formatDuration(pkg.day)}</span>
                {pkg.data && pkg.data !== 'Unlimited' && (
                  <span>{pkg.data}</span>
                )}
              </div>
              {/* Mostrar minutos y SMS si están disponibles */}
              {(pkg.voice || pkg.text) && (
                <div className="flex space-x-4 mt-2 text-xs text-white/50">
                  {pkg.voice && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{pkg.voice} mins</span>
                    </div>
                  )}
                  {pkg.text && (
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{pkg.text} SMS</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Características */}
        <div className="space-y-3 mb-8" style={{ transform: "translateZ(20px)" }}>
          {plan.features.map((feature, featureIndex) => (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + featureIndex * 0.1 }}
              className="flex items-center space-x-3"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
              <span className="text-white/80 text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

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
      {/* <ParticleField count={30} /> */}
      
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

  return (
    <section className="relative py-40 bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)',
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
            Ready to Stay
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Connected?
            </motion.span>
          </h2>

          <p className="text-xl lg:text-2xl text-white/70 leading-relaxed">
            Get your eSIM now and enjoy seamless connectivity in 150+ countries
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <motion.button
            onClick={handleViewAllPlans}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ 
                scale: 1.1,
                y: -5,
                boxShadow: "0 0 50px rgba(56, 189, 248, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Energy Effect */}
              <motion.div
                animate={isHovered ? { scale: [1, 2, 1], opacity: [0.5, 0.8, 0.5] } : { scale: 1, opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl"
              />
              
              <span className="relative z-10 flex items-center space-x-3">
                <span>Get Your eSIM Now</span>
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

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
              { icon: "🌍", text: "150+ Countries" }
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