// services/adsService.ts
import axios from 'axios';

// Interfaces
export interface Ad {
  _id: string;
  title: string;
  description: string;
  expirationDate: string;
  amount: number;
  category: string;
  mediaUrl: string;
  createdBy: string | {
    _id: string;
    username?: string;
    email?: string;
  };
  isActive: boolean;
  externalLink?: string;
  type: 'IMAGE' | 'VIDEO';
  createdAt: string;
  updatedAt?: string;
}

export interface AdCreatePayload {
  title: string;
  description: string;
  expirationDate: string; // ISO 8601 format
  amount: number;
  category: string;
  mediaUrl: string;
  createdBy: string; // user ID
  externalLink?: string;
  type: 'IMAGE' | 'VIDEO';
}

export interface AdUpdatePayload {
  title?: string;
  description?: string;
  expirationDate?: string;
  amount?: number;
  category?: string;
  mediaUrl?: string;
  isActive?: boolean;
  externalLink?: string;
}

// Base URL para API endpoints
const API_BASE_URL = 'https://api.triptapmedia.com/api';

// Servicio de anuncios
export const adsService = {
  // Obtener todos los anuncios
  getAllAds: async (type?: 'IMAGE' | 'VIDEO'): Promise<Ad[]> => {
    try {
      let url = `${API_BASE_URL}/ads/`;
      if (type) {
        url += `?type=${type}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw new Error('No se pudieron cargar los anuncios');
    }
  },
  
  // Obtener un anuncio por ID
  getAdById: async (id: string): Promise<Ad> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ad ${id}:`, error);
      throw new Error('No se pudo cargar el anuncio');
    }
  },
  
  // Crear un nuevo anuncio
  createAd: async (adData: AdCreatePayload): Promise<Ad> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ads`, adData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating ad:', error);
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(', ');
        throw new Error(`Error en los datos: ${errorMessage}`);
      }
      throw new Error('No se pudo crear el anuncio');
    }
  },
  
  // Actualizar un anuncio existente
  updateAd: async (id: string, adData: AdUpdatePayload): Promise<Ad> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/ads/${id}`, adData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ad ${id}:`, error);
      throw new Error('No se pudo actualizar el anuncio');
    }
  },
  
  // Eliminar un anuncio
  deleteAd: async (id: string): Promise<{ msg: string }> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/ads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ad ${id}:`, error);
      throw new Error('No se pudo eliminar el anuncio');
    }
  },
  
  // Deducir el costo de visualización de un anuncio
  deductAdCost: async (adId: string, deviceCode: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ads/deduct/${adId}/${deviceCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error deducting cost for ad ${adId}:`, error);
      throw new Error('No se pudo procesar el cargo por visualización');
    }
  },

  // Cargar archivo para anuncio
  uploadAdMedia: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('media', file);
      
      const response = await axios.post(`${API_BASE_URL}/uploads/ad-media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('No se pudo cargar el archivo multimedia');
    }
  },
  
  // Eliminar múltiples anuncios (requiere implementación en el backend)
  deleteMultipleAds: async (ids: string[]): Promise<{ msg: string }> => {
    try {
      // Esta es una implementación sugerida, necesitarías crear este endpoint en el backend
      const response = await axios.post(`${API_BASE_URL}/ads/batch-delete`, { ids });
      return response.data;
    } catch (error) {
      console.error('Error deleting multiple ads:', error);
      throw new Error('No se pudieron eliminar los anuncios seleccionados');
    }
  },
  
  // Obtener estadísticas de anuncios (visualizaciones, clics, etc)
  getAdStats: async (adId: string): Promise<any> => {
    try {
      // Esta es una implementación sugerida, necesitarías crear este endpoint en el backend
      const response = await axios.get(`${API_BASE_URL}/ads/${adId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for ad ${adId}:`, error);
      throw new Error('No se pudieron cargar las estadísticas');
    }
  }
};