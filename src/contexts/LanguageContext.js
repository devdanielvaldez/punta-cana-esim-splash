'use client';
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      searchPlaceholder: "Where are you traveling to?",
      days: "Days",
      search: "Search eSIM",
      heroTitle: "Stay Connected Worldwide",
      heroSubtitle: "Instant eSIM for your travels. No physical SIM needed.",
      features: "Why Choose Us",
      coverage: "Global Coverage",
      instant: "Instant Activation",
      support: "24/7 Support",
      duration: "Duration",
      dataAmount: "Data Amount",
      maxPrice: "Max Price",
      anyData: "Any Data"
    },
    es: {
      searchPlaceholder: "¿A dónde viajas?",
      days: "Días",
      search: "Buscar eSIM",
      heroTitle: "Conectado en Todo el Mundo",
      heroSubtitle: "eSIM instantánea para tus viajes. No necesitas SIM física.",
      features: "Por Qué Elegirnos",
      coverage: "Cobertura Global",
      instant: "Activación Instantánea",
      support: "Soporte 24/7",
      duration: "Duración",
      dataAmount: "Cantidad de Datos",
      maxPrice: "Precio Máximo",
      anyData: "Cualquier Dato"
    },
    fr: {
      searchPlaceholder: "Où voyagez-vous?",
      days: "Jours",
      search: "Rechercher eSIM",
      heroTitle: "Restez Connecté dans le Monde Entier",
      heroSubtitle: "eSIM instantanée pour vos voyages. Pas besoin de carte SIM physique.",
      features: "Pourquoi Nous Choisir",
      coverage: "Couverture Mondiale",
      instant: "Activation Instantanée",
      support: "Support 24/7",
      duration: "Durée",
      dataAmount: "Quantité de Données",
      maxPrice: "Prix Maximum",
      anyData: "Toutes Données"
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};