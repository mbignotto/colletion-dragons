import axios from 'axios';

const API_URL = 'http://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon';

export interface Dragon {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

export const dragonService = {
  async getAllDragons(): Promise<Dragon[]> {
    const response = await axios.get(API_URL);
    return response.data.sort((a: Dragon, b: Dragon) => a.name.localeCompare(b.name));
  },

  async getDragon(id: string): Promise<Dragon> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createDragon(dragon: Omit<Dragon, 'id' | 'createdAt'>): Promise<Dragon> {
    const response = await axios.post(API_URL, dragon);
    return response.data;
  },

  async updateDragon(id: string, dragon: Partial<Dragon>): Promise<Dragon> {
    const response = await axios.put(`${API_URL}/${id}`, dragon);
    return response.data;
  },

  async deleteDragon(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};