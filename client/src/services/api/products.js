import api from '@/services/api'

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    console.log('API Response:', response);
    if (!response || !response.data) {
      throw new Error('Product not found');
    }
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 