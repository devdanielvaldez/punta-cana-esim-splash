'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Globe, Wifi, Calendar, DollarSign, 
  ChevronDown, Check, X, MapPin, CreditCard, User, 
  Mail, Phone, Map, Loader, ArrowLeft, Shield
} from 'lucide-react';

const AllPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    country: '',
    dataAmount: '',
    duration: '',
    priceRange: 50,
    operator: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

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
        setError('Failed to load plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter and sort plans - Dominican Republic first
  const filteredPlans = useMemo(() => {
    if (!plans.length) return [];

    let filtered = [...plans];

    // Sort: Dominican Republic first, then others
    filtered.sort((a, b) => {
      if (a.slug === 'dominican-republic') return -1;
      if (b.slug === 'dominican-republic') return 1;
      return a.title.localeCompare(b.title);
    });

    // Filter by country (slug)
    if (filters.country) {
      filtered = filtered.filter(plan => 
        plan.slug.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.operators?.some(op => 
          op.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by data amount
    if (filters.dataAmount) {
      filtered = filtered.map(plan => ({
        ...plan,
        operators: plan.operators?.map(operator => ({
          ...operator,
          packages: operator.packages?.filter(pkg => {
            if (filters.dataAmount === 'unlimited') return pkg.is_unlimited;
            if (filters.dataAmount === '1gb') return pkg.amount >= 1024 && pkg.amount < 5120;
            if (filters.dataAmount === '5gb') return pkg.amount >= 5120 && pkg.amount < 10240;
            if (filters.dataAmount === '10gb') return pkg.amount >= 10240 && pkg.amount < 20480;
            if (filters.dataAmount === '20gb') return pkg.amount >= 20480;
            return true;
          })
        })).filter(operator => operator.packages?.length > 0)
      })).filter(plan => plan.operators?.length > 0);
    }

    // Filter by duration
    if (filters.duration) {
      filtered = filtered.map(plan => ({
        ...plan,
        operators: plan.operators?.map(operator => ({
          ...operator,
          packages: operator.packages?.filter(pkg => {
            if (filters.duration === '7days') return pkg.day <= 7;
            if (filters.duration === '15days') return pkg.day > 7 && pkg.day <= 15;
            if (filters.duration === '30days') return pkg.day > 15 && pkg.day <= 30;
            if (filters.duration === '30plus') return pkg.day > 30;
            return true;
          })
        })).filter(operator => operator.packages?.length > 0)
      })).filter(plan => plan.operators?.length > 0);
    }

    // Filter by price
    filtered = filtered.map(plan => ({
      ...plan,
      operators: plan.operators?.map(operator => ({
        ...operator,
        packages: operator.packages?.filter(pkg => pkg.price <= filters.priceRange)
      })).filter(operator => operator.packages?.length > 0)
    })).filter(plan => plan.operators?.length > 0);

    // Filter by operator
    if (filters.operator) {
      filtered = filtered.map(plan => ({
        ...plan,
        operators: plan.operators?.filter(operator => 
          operator.title.toLowerCase().includes(filters.operator.toLowerCase())
        )
      })).filter(plan => plan.operators?.length > 0);
    }

    return filtered;
  }, [plans, filters, searchQuery]);

  // Get unique operators for filter
  const operators = useMemo(() => {
    const allOperators = plans.flatMap(plan => 
      plan.operators?.map(op => op.title) || []
    );
    return [...new Set(allOperators)].filter(Boolean);
  }, [plans]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      country: '',
      dataAmount: '',
      duration: '',
      priceRange: 50,
      operator: ''
    });
    setSearchQuery('');
  };

  // Handle plan selection
  const handlePlanSelect = (plan, operator, packageItem) => {
    setSelectedPlan({
      country: plan.title,
      countrySlug: plan.slug,
      operator: operator.title,
      package: packageItem,
      image: plan.image?.url
    });
    setCheckoutData(null);
  };

  // Handle back to plans
  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setCheckoutData(null);
  };

  if (selectedPlan && checkoutData) {
    return (
      <CheckoutPage 
        selectedPlan={selectedPlan}
        checkoutData={checkoutData}
        onBack={handleBackToPlans}
      />
    );
  }

  if (selectedPlan) {
    return (
      <OrderForm 
        selectedPlan={selectedPlan}
        onBack={handleBackToPlans}
        onSubmit={setCheckoutData}
      />
    );
  }

  return (
    <PlanSelectionView
      loading={loading}
      error={error}
      filteredPlans={filteredPlans}
      filters={filters}
      setFilters={setFilters}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      operators={operators}
      resetFilters={resetFilters}
      onPlanSelect={handlePlanSelect}
    />
  );
};

// Plan Selection View Component
const PlanSelectionView = ({
  loading,
  error,
  filteredPlans,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  searchQuery,
  setSearchQuery,
  operators,
  resetFilters,
  onPlanSelect
}) => {
  // Format data display
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-8"
            />
            <p className="text-white text-xl">Loading available plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-400">
            <p className="text-xl">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        // 
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Global eSIM Plans
              </h1>
              <p className="text-white/70 mt-2">
                Stay connected worldwide with our premium eSIM packages
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-slate-800/50 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Country Search */}
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Country</span>
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                {/* Data Amount */}
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span>Data</span>
                  </label>
                  <select
                    value={filters.dataAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, dataAmount: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">All Data</option>
                    <option value="1gb">1GB+</option>
                    <option value="5gb">5GB+</option>
                    <option value="10gb">10GB+</option>
                    <option value="20gb">20GB+</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Duration</span>
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">Any Duration</option>
                    <option value="7days">Up to 7 Days</option>
                    <option value="15days">8-15 Days</option>
                    <option value="30days">16-30 Days</option>
                    <option value="30plus">30+ Days</option>
                  </select>
                </div>

                {/* Operator */}
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Operator</span>
                  </label>
                  <select
                    value={filters.operator}
                    onChange={(e) => setFilters(prev => ({ ...prev, operator: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">All Operators</option>
                    {operators.map(operator => (
                      <option key={operator} value={operator}>{operator}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2 lg:col-span-4">
                  <label className="flex items-center space-x-2 text-white font-medium mb-3">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span>Max Price: ${filters.priceRange}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: Number(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                  />
                  <div className="flex justify-between text-sm text-white/70 mt-2">
                    <span>$1</span>
                    <span>$50</span>
                    <span>$100</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <p className="text-white/70">
            Showing {filteredPlans.length} countries with available plans
          </p>
          
          {filteredPlans.some(plan => plan.slug === 'dominican-republic') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Dominican Republic Featured</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No plans found</h3>
            <p className="text-white/70 max-w-md mx-auto">
              Try adjusting your filters or search terms to find more eSIM plans.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredPlans.map((plan, index) => (
              <PlanCard 
                key={plan.slug} 
                plan={plan} 
                index={index}
                formatData={formatData}
                formatDuration={formatDuration}
                onPlanSelect={onPlanSelect}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Individual Plan Card Component
const PlanCard = ({ plan, index, formatData, formatDuration, onPlanSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const allPackages = plan.operators?.flatMap(op => op.packages || []) || [];
  const minPrice = allPackages.length > 0 ? Math.min(...allPackages.map(pkg => pkg.price)) : 0;
  const maxPrice = allPackages.length > 0 ? Math.max(...allPackages.map(pkg => pkg.price)) : 0;

  const isDominicanRepublic = plan.slug === 'dominican-republic';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative group ${isDominicanRepublic ? 'lg:col-span-2 xl:col-span-1' : ''}`}
    >
      <div className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border p-6 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/10 ${
        isDominicanRepublic 
          ? 'border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
          : 'border-white/20 hover:border-cyan-400/30'
      }`}>
        {/* Special badge for Dominican Republic */}
        {isDominicanRepublic && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            🇩🇴 Featured
          </div>
        )}

        {/* Country Header */}
        <div className="flex items-center space-x-4 mb-4">
          {plan.image && (
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={plan.image.url}
              alt={plan.title}
              className="w-12 h-9 object-cover rounded-lg border border-white/20 shadow-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{plan.title}</h3>
            <p className="text-white/60 text-sm">
              {plan.operators?.length || 0} operator{plan.operators?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-white/70 mb-2">
            <span>Price Range</span>
            <span>{allPackages.length} plans</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cyan-400">${minPrice}</span>
            <span className="text-white/50">-</span>
            <span className="text-xl font-semibold text-white">${maxPrice}</span>
          </div>
        </div>

        {/* Operators Preview */}
        <div className="space-y-3 mb-4">
          {plan.operators?.slice(0, 2).map((operator, opIndex) => (
            <div key={opIndex} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div>
                <p className="text-white font-medium text-sm">{operator.title}</p>
                <p className="text-white/60 text-xs">
                  {operator.packages?.length} package{operator.packages?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-bold text-sm">
                  ${operator.packages && operator.packages.length > 0 ? Math.min(...operator.packages.map(p => p.price)) : 0}
                </p>
                <p className="text-white/50 text-xs">from</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expand Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20"
        >
          <span>{expanded ? 'Show Less' : 'View All Plans'}</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4 overflow-hidden"
            >
              {plan.operators?.map((operator, opIndex) => (
                <motion.div
                  key={opIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: opIndex * 0.1 }}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <span>{operator.title}</span>
                    {operator.esim_type && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                        {operator.esim_type}
                      </span>
                    )}
                  </h4>

                  {/* Operator Packages */}
                  <div className="space-y-2">
                    {operator.packages?.slice(0, 5).map((pkg, pkgIndex) => (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (opIndex + pkgIndex) * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer group border border-white/5"
                        onClick={() => onPlanSelect(plan, operator, pkg)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="text-left">
                              <p className="text-white font-medium">
                                {formatData(pkg.amount)}
                              </p>
                              <p className="text-white/60 text-sm">
                                {formatDuration(pkg.day)}
                              </p>
                            </div>
                            {(pkg.voice || pkg.text) && (
                              <div className="flex space-x-2 text-xs text-white/50">
                                {pkg.voice && (
                                  <span>{pkg.voice} mins</span>
                                )}
                                {pkg.text && (
                                  <span>{pkg.text} SMS</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-400 font-bold text-lg">
                            ${pkg.price}
                          </p>
                          {/* {pkg.net_price && (
                            <p className="text-white/50 text-xs line-through">
                              ${pkg.net_price.USD}
                            </p>
                          )} */}
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="text-cyan-400 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Select →
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {operator.packages && operator.packages.length > 5 && (
                    <p className="text-white/50 text-sm text-center mt-3">
                      +{operator.packages.length - 5} more packages
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Order Form Component
const OrderForm = ({ selectedPlan, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    package_id: selectedPlan.package.id || '',
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

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
        onSubmit(data);
      } else {
        setErrors({ submit: "We're sorry, we were unable to process your payment at this time." });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedPlan.image && (
                    <img
                      src={selectedPlan.image}
                      alt={selectedPlan.country}
                      className="w-16 h-12 object-cover rounded-lg border border-white/20"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{selectedPlan.country}</h3>
                    <p className="text-white/60 text-sm">{selectedPlan.operator}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-white">
                    <span>Data:</span>
                    <span className="font-semibold">
                      {selectedPlan.package.amount ? 
                        `${selectedPlan.package.amount / 1024} GB` : 'Unlimited'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Duration:</span>
                    <span className="font-semibold">
                      {selectedPlan.package.day} Days
                    </span>
                  </div>
                  {selectedPlan.package.voice && (
                    <div className="flex justify-between text-white">
                      <span>Voice:</span>
                      <span className="font-semibold">
                        {selectedPlan.package.voice} mins
                      </span>
                    </div>
                  )}
                  {selectedPlan.package.text && (
                    <div className="flex justify-between text-white">
                      <span>SMS:</span>
                      <span className="font-semibold">
                        {selectedPlan.package.text} texts
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-white text-lg">
                    <span>Total:</span>
                    <span className="text-2xl font-bold text-cyan-400">
                      ${selectedPlan.package.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
              <p className="text-white/60 mb-8">Complete your eSIM purchase securely</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
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

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-white font-medium mb-3">
                      <Map className="w-4 h-4 text-cyan-400" />
                      <span>Address</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-white font-medium mb-3">
                      <Map className="w-4 h-4 text-cyan-400" />
                      <span>City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-white font-medium mb-3">
                      <Map className="w-4 h-4 text-cyan-400" />
                      <span>State</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-white font-medium mb-3">
                      <Map className="w-4 h-4 text-cyan-400" />
                      <span>Postal Code</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-white font-medium mb-3">
                      <Map className="w-4 h-4 text-cyan-400" />
                      <span>Country</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
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
                {errors.submit && (
                  <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
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
                      <span>Complete Purchase - ${selectedPlan.package.price}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Checkout Success Page
const CheckoutPage = ({ selectedPlan, checkoutData, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/25">
            <Check className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-white/70 text-lg mb-8">
            Your eSIM has been successfully activated
          </p>

          {/* Order Details */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedPlan.image && (
                  <img
                    src={selectedPlan.image}
                    alt={selectedPlan.country}
                    className="w-16 h-12 object-cover rounded-lg border border-white/20"
                  />
                )}
                <div>
                  <h3 className="text-white font-semibold text-lg">{selectedPlan.country}</h3>
                  <p className="text-white/60">{selectedPlan.operator}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/60 text-sm">Data</p>
                  <p className="text-white font-semibold">
                    {selectedPlan.package.amount ? 
                      `${selectedPlan.package.amount / 1024} GB` : 'Unlimited'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Duration</p>
                  <p className="text-white font-semibold">
                    {selectedPlan.package.day} Days
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Order Total</p>
                  <p className="text-cyan-400 font-bold text-xl">
                    ${selectedPlan.package.price}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Status</p>
                  <p className="text-green-400 font-semibold">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Next Steps</h3>
            <div className="space-y-3 text-white/70">
              <p>📧 Check your email for the eSIM installation instructions</p>
              <p>📱 Follow the steps to install your eSIM on your device</p>
              <p>🌍 Activate the eSIM when you arrive at your destination</p>
              <p>💬 Contact support if you need any help</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
            >
              Browse More Plans
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              View Installation Guide
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AllPlansPage;