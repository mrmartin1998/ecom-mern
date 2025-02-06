import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductInfo from '@/components/features/product/ProductInfo';
import ProductGallery from '@/components/features/product/ProductGallery';
import AddToCartSection from '@/components/features/product/AddToCartSection';
import RelatedProducts from '@/components/features/product/RelatedProducts';
import { getProduct } from '@/services/api/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  const { 
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    retry: 1, // Only retry once
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      console.error('Error fetching product:', error);
    }
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 w-3/4 mb-4"></div>
          <div className="h-4 bg-base-300 w-1/2 mb-2"></div>
          <div className="h-4 bg-base-300 w-1/3"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Error loading product: {error.message}</span>
        </div>
      </div>
    );
  }

  // Handle product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <span>Product not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-8">
        <ul>
          <li><a href="/products">Products</a></li>
          <li>{product.name}</li>
        </ul>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Gallery */}
        <ProductGallery 
          mainImage={product.imageUrl}
          images={product.images || []}
          productName={product.name}
        />

        {/* Right Column - Info and Cart */}
        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />
          <AddToCartSection product={product} />
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default ProductDetailPage;
