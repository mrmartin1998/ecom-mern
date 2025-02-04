import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl h-[400px] animate-pulse">
      {/* Image skeleton */}
      <figure className="h-48 bg-base-300" />
      
      <div className="card-body">
        {/* Title skeleton */}
        <div className="h-4 bg-base-300 rounded w-3/4 mb-2" />
        
        {/* Price skeleton */}
        <div className="h-6 bg-base-300 rounded w-1/4 mb-4" />
        
        {/* Stock status skeleton */}
        <div className="h-4 bg-base-300 rounded w-1/2 mb-4" />
        
        {/* Buttons skeleton */}
        <div className="card-actions justify-end mt-auto gap-2">
          <div className="h-10 bg-base-300 rounded w-full" />
          <div className="h-10 bg-base-300 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
