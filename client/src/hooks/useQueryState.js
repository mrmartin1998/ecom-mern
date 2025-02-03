import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

function useQueryState(key, endpoint, options = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await api.get(endpoint);
      return response.data;
    },
    ...options
  });

  return {
    data,
    isLoading,
    error,
    refetch
  };
}

export default useQueryState; 