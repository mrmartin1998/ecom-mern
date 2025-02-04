import React from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const ProductGrid = ({ products, isLoading, error }) => {
  // If there's an error, display error message
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-error">Error loading products: {error.message}</p>
      </div>
    );
  }

  // If loading, show skeleton grid
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // If no products, show empty state
  if (!products?.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="text-base-content/60">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Render product grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
