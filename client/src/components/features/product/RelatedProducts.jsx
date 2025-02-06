import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import ProductCard from '@/components/features/products/ProductCard';
import ProductSkeleton from '@/components/features/products/ProductSkeleton';

const RelatedProducts = ({ currentProduct }) => {
  const { data: relatedProducts, isLoading, error } = useQuery({
    queryKey: ['relatedProducts', currentProduct.category, currentProduct._id],
    queryFn: async () => {
      const response = await api.get('/products', {
        params: {
          category: currentProduct.category,
          limit: 4,
          excludeId: currentProduct._id
        }
      });
      return response.data;
    },
    enabled: !!currentProduct,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  if (error) {
    return null; // Silently fail for related products
  }

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts?.data?.length) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
