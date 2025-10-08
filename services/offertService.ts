// services/offertsService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.triptapmedia.com';

export interface Offer {
  _id: string;
  title: string;
  description: string;
  image: string;
  cost: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export const offertsService = {
  // Obtener todas las ofertas
  async getAllOfferts(): Promise<Offer[]> {
    const response = await axios.get(`${API_URL}/api/offerts`);
    return response.data;
  },

  // Obtener una oferta por ID
  async getOffertById(id: string): Promise<Offer> {
    const response = await axios.get(`${API_URL}/api/offerts/${id}`);
    return response.data;
  },

  // Crear una nueva oferta
  async createOffert(offertData: Omit<Offer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
    const response = await axios.post(`${API_URL}/api/offerts`, offertData);
    return response.data;
  },

  // Actualizar una oferta existente
  async updateOffert(id: string, offertData: Partial<Offer>): Promise<Offer> {
    const response = await axios.put(`${API_URL}/api/offerts/${id}`, offertData);
    return response.data;
  },

  // Cambiar el estado de una oferta (activar/desactivar)
  async toggleOffertStatus(id: string): Promise<Offer> {
    const response = await axios.post(`${API_URL}/api/offerts/${id}/toggle`, {});
    return response.data;
  }
};