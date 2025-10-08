// services/newsService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.triptapmedia.com';


export const newsService = {
  // Obtener todas las noticias
  async getAllNews() {
    const response = await axios.get(`${API_URL}/api/news`);
    return response.data;
  },

  // Obtener una noticia por ID
  async getNewsById(id) {
    const response = await axios.get(`${API_URL}/api/news/${id}`);
    return response.data;
  },

  // Crear una nueva noticia
  async createNews(newsData) {
    const response = await axios.post(`${API_URL}/api/news`, newsData);
    return response.data;
  },

  // Actualizar una noticia existente
  async updateNews(id, newsData) {
    const response = await axios.put(`${API_URL}/api/news/${id}`, newsData);
    return response.data;
  },

  async toggleNewsStatus(id) {
    const response = await axios.post(`${API_URL}/api/news/${id}/toggle`, {});
    return response.data;
  }
};