import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { user, login } = useAuth();

  // Fetch cart data only if user is authenticated
  const { data: cart, isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const response = await api.get('/carts');
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    // Only fetch if user is authenticated
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add to cart mutation with auth check
  const { mutate: addToCart, isLoading: isAddingToCart } = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      if (!user) {
        throw new Error('Please login to add items to cart');
      }
      const response = await api.post('/carts/items', { productId, quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Item added to cart');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to add item to cart';
      toast.error(message);
    },
  });

  // Update quantity mutation
  const { mutate: updateQuantity, isLoading: isUpdatingQuantity } = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await api.patch(`/carts/items/${productId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart updated');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    },
  });

  // Remove item mutation
  const { mutate: removeItem, isLoading: isRemovingItem } = useMutation({
    mutationFn: async (productId) => {
      const response = await api.delete(`/carts/items/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
    },
  });

  // Clear cart mutation
  const { mutate: clearCart, isLoading: isClearingCart } = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/carts');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart cleared');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    },
  });

  const isLoading = 
    isLoadingCart || 
    isAddingToCart || 
    isUpdatingQuantity || 
    isRemovingItem || 
    isClearingCart;

  return {
    cart,
    isLoading,
    isAuthenticated: !!user,
    addToCart: (productId, quantity) => addToCart({ productId, quantity }),
    updateQuantity,
    removeItem,
    clearCart,
  };
};
