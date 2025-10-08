// services/funsService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.triptapmedia.com/api';

export const funsService = {
  getAllFuns: async () => {
    try {
      const response = await axios.get(`${API_URL}/funs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fun events:', error);
      throw error;
    }
  },
  
  getFunById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/funs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fun event with id ${id}:`, error);
      throw error;
    }
  },
  
  createFun: async (funData) => {
    try {
      const response = await axios.post(`${API_URL}/funs`, funData);
      return response.data;
    } catch (error) {
      console.error('Error creating fun event:', error);
      throw error;
    }
  },
  
  updateFun: async (id, funData) => {
    try {
      const response = await axios.put(`${API_URL}/funs/${id}`, funData);
      return response.data;
    } catch (error) {
      console.error(`Error updating fun event with id ${id}:`, error);
      throw error;
    }
  },
  
  toggleFunStatus: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/funs/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling status for fun event with id ${id}:`, error);
      throw error;
    }
  }
};