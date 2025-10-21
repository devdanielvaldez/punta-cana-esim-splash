'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Wifi, Clock, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Results = ({ results, isLoading, error, onBack }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for eSIM plans...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600"
        >
          <p>{error}</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!results?.data?.length) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-600">No eSIM plans found for your search.</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Available eSIM Plans
          </h1>
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {results.data.map((country, index) => (
            <motion.div
              key={country.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Country Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={country.image.url}
                    alt={country.title}
                    className="w-12 h-9 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {country.title}
                    </h3>
                    <p className="text-gray-600">{country.operators.length} operators</p>
                  </div>
                </div>
              </div>

              {/* Operators */}
              <div className="p-6 space-y-4">
                {country.operators.map((operator) => (
                  <div
                    key={operator.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{operator.title}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        {operator.plan_type}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-4 h-4" />
                        <span>{operator.info[0]}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Valid for {operator.packages[0]?.day} days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>{operator.coverages[0]?.name}</span>
                      </div>
                    </div>

                    {/* Packages */}
                    <div className="mt-4 space-y-2">
                      {operator.packages.slice(0, 2).map((pkg) => (
                        <div
                          key={pkg.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">
                              {pkg.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {pkg.data} • {pkg.day} days
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">
                              ${pkg.price}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              ${pkg.prices?.recommended_retail_price?.USD}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Results;