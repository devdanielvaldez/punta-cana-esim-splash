'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Results from '../components/Result';
import { getAllEsimData, filterEsimData } from '../services/esimService';
import { LanguageProvider } from '../contexts/LanguageContext';
import { BenefitsSection3D, FinalCTASection3D, RealPlansSection, TestimonialsSection3D } from '@/components/AllSections';

function HomeContent() {
  const [allEsimData, setAllEsimData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los datos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllEsimData();
        setAllEsimData(data);
      } catch (err) {
        setError('Failed to load eSIM data');
        console.error('Data loading error:', err);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (filters) => {
    if (!allEsimData) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Filtrar en el front-end
      const filteredData = filterEsimData(allEsimData, filters);
      setSearchResults({ 
        ...allEsimData, 
        data: filteredData,
        filters 
      });
    } catch (err) {
      setError('Failed to filter eSIM plans');
      console.error('Filter error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <Header 
        onSearch={handleSearch} 
        allCountries={allEsimData}
      /> */}
      
      <AnimatePresence mode="wait">
        {!searchResults ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
      <BenefitsSection3D />
      <RealPlansSection />
      <TestimonialsSection3D />
      <FinalCTASection3D />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Results 
              results={searchResults} 
              isLoading={isLoading}
              error={error}
              onBack={() => setSearchResults(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}