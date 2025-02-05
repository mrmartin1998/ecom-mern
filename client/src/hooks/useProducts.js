import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProducts = async ({ search, category, sort, page = 1, limit = 12, priceRange, stockStatus }) => {
  const params = new URLSearchParams();
  
  // Add search params if present
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (sort) params.append('sort', sort);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  
  // Add price range if present
  if (priceRange?.min) params.append('minPrice', priceRange.min);
  if (priceRange?.max) params.append('maxPrice', priceRange.max);
  
  // Add stock status if present
  if (stockStatus && stockStatus !== 'all') {
    params.append('inStock', stockStatus === 'inStock');
  }

  const response = await axios.get(`/api/products?${params.toString()}`);
  return response.data;
};

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true, // Useful for pagination
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 