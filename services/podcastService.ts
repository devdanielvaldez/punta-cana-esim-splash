// services/podcastService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.triptapmedia.com';

// Interfaces para modelar la estructura de datos
export interface Episode {
  _id?: string;
  title: string;
  image: string;
  audioUrl: string;
  plays?: number;
}

export interface Season {
  _id?: string;
  name: string;
  image: string;
  episodes: Episode[];
}

export interface Podcast {
  _id: string;
  name: string;
  description: string;
  image: string;
  seasons: Season[];
  totalPlays: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para cuando creamos un podcast (solo datos iniciales)
export interface PodcastCreateData {
  name: string;
  description: string;
  image: string;
}

export const podcastService = {
  // Obtener todos los podcasts
  async getAllPodcasts(): Promise<Podcast[]> {
    const response = await axios.get(`${API_URL}/api/podcasts`);
    return response.data;
  },

  // Obtener un podcast por ID
  async getPodcastById(id: string): Promise<Podcast> {
    const response = await axios.get(`${API_URL}/api/podcasts/${id}`);
    return response.data;
  },

  // Crear un nuevo podcast
  async createPodcast(podcastData: PodcastCreateData): Promise<Podcast> {
    const response = await axios.post(`${API_URL}/api/podcasts`, podcastData);
    return response.data;
  },

  // Actualizar un podcast existente
  async updatePodcast(id: string, podcastData: PodcastCreateData): Promise<Podcast> {
    const response = await axios.put(`${API_URL}/api/podcasts/${id}`, podcastData);
    return response.data;
  },

  // === TEMPORADAS ===

  // Añadir una nueva temporada
  async addSeason(podcastId: string, seasonData: { name: string, image: string }): Promise<Podcast> {
    const response = await axios.post(
      `${API_URL}/api/podcasts/${podcastId}/seasons`, 
      seasonData
    );
    return response.data;
  },

  // Editar una temporada existente
  async updateSeason(
    podcastId: string, 
    seasonId: string, 
    seasonData: { name: string, image: string }
  ): Promise<Podcast> {
    const response = await axios.put(
      `${API_URL}/api/podcasts/${podcastId}/seasons/${seasonId}`,
      seasonData
    );
    return response.data;
  },

  // Eliminar una temporada
  async deleteSeason(podcastId: string, seasonId: string): Promise<Podcast> {
    const response = await axios.delete(
      `${API_URL}/api/podcasts/${podcastId}/seasons/${seasonId}`
    );
    return response.data;
  },

  // === EPISODIOS ===

  // Añadir un nuevo episodio
  async addEpisode(
    podcastId: string, 
    seasonId: string, 
    episodeData: { title: string, image: string, audioUrl: string }
  ): Promise<Podcast> {
    const response = await axios.post(
      `${API_URL}/api/podcasts/${podcastId}/seasons/${seasonId}/episodes`,
      episodeData
    );
    return response.data;
  },

  // Editar un episodio existente
  async updateEpisode(
    podcastId: string,
    seasonId: string,
    episodeId: string,
    episodeData: { title: string, image: string, audioUrl: string }
  ): Promise<Podcast> {
    const response = await axios.put(
      `${API_URL}/api/podcasts/${podcastId}/seasons/${seasonId}/episodes/${episodeId}`,
      episodeData
    );
    return response.data;
  },

  // Eliminar un episodio
  async deleteEpisode(podcastId: string, seasonId: string, episodeId: string): Promise<Podcast> {
    const response = await axios.delete(
      `${API_URL}/api/podcasts/${podcastId}/seasons/${seasonId}/episodes/${episodeId}`
    );
    return response.data;
  }
};