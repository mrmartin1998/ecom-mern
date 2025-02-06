import React from 'react';
import { formatCurrency } from '@/utils/formatters';

const ProductInfo = ({ product }) => {
  const {
    name,
    description,
    price,
    stockQuantity,
    category
  } = product;

  // Stock status indicator
  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return { text: 'Out of Stock', color: 'text-error' };
    }
    if (stockQuantity < 5) {
      return { text: `Only ${stockQuantity} left!`, color: 'text-warning' };
    }
    return { text: 'In Stock', color: 'text-success' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="flex flex-col gap-4">
      {/* Product Name */}
      <h1 className="text-3xl font-bold">{name}</h1>

      {/* Price and Stock Status */}
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold">
          {formatCurrency(price)}
        </span>
        <span className={`badge ${stockStatus.color}`}>
          {stockStatus.text}
        </span>
      </div>

      {/* Category */}
      <div className="flex items-center gap-2">
        <span className="text-base-content/60">Category:</span>
        <span className="capitalize badge badge-ghost">{category}</span>
      </div>

      {/* Description */}
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-base-content/80">{description}</p>
      </div>

      {/* Additional Details */}
      <div className="divider"></div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <ul className="list-disc list-inside text-base-content/80">
          <li>SKU: {product._id}</li>
          <li>Availability: {stockQuantity} units</li>
          {/* Add more details as needed */}
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
