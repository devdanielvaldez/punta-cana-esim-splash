import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.triptapmedia.com/api';

export const musicService = {
  getAllMusic: async () => {
    try {
      const response = await axios.get(`${API_URL}/music`);
      return response.data;
    } catch (error) {
      console.error('Error fetching music:', error);
      throw error;
    }
  },
  
  getMusicById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/music/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching music with id ${id}:`, error);
      throw error;
    }
  },
  
  createMusic: async (musicData) => {
    try {
      const response = await axios.post(`${API_URL}/music`, musicData);
      return response.data;
    } catch (error) {
      console.error('Error creating music:', error);
      throw error;
    }
  },
  
  updateMusic: async (id, musicData) => {
    try {
      const response = await axios.put(`${API_URL}/music/${id}`, musicData);
      return response.data;
    } catch (error) {
      console.error(`Error updating music with id ${id}:`, error);
      throw error;
    }
  },
  
  deleteMusic: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/music/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting music with id ${id}:`, error);
      throw error;
    }
  }
};