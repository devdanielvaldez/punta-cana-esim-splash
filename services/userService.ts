// services/userService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.triptapmedia.com/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  userType: 'CUSTOMER' | 'DRIVER' | 'ADVERTISEMENT' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  /**
   * Obtiene todos los usuarios
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/customer/all`);
    return response.data.users || [];
  },

  /**
   * Obtiene un usuario por su ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/customer/${id}`);
    return response.data.user;
  },

  /**
   * Elimina un usuario por su ID
   */
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/customer/${id}`);
    return response.data;
  },

  /**
   * Elimina múltiples usuarios
   */
  deleteMultipleUsers: async (ids: string[]): Promise<void> => {
    await Promise.all(
      ids.map(id => axios.delete(`${API_URL}/customer/${id}`))
    );
  },
  
  /**
   * Función unificada para eliminar uno o varios usuarios
   */
  deleteUsers: async (ids: string | string[]): Promise<void> => {
    if (Array.isArray(ids)) {
      return userService.deleteMultipleUsers(ids);
    } else {
      await userService.deleteUser(ids);
    }
  }
};