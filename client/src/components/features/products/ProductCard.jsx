import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    price,
    imageUrl,
    stockQuantity,
    description
  } = product;

  const isInStock = stockQuantity > 0;

  return (
    <div className="card bg-base-100 shadow-xl h-[400px]">
      {/* Product Image */}
      <figure className="h-48 relative">
        <img 
          src={imageUrl || '/placeholder-product.png'} 
          alt={name}
          className="object-cover w-full h-full"
        />
        {!isInStock && (
          <div className="absolute top-2 right-2">
            <span className="badge badge-error">Out of Stock</span>
          </div>
        )}
      </figure>
      
      <div className="card-body">
        {/* Product Title */}
        <h2 className="card-title text-lg truncate">{name}</h2>
        
        {/* Price */}
        <p className="text-xl font-bold">${price.toFixed(2)}</p>
        
        {/* Stock Status */}
        <p className={`text-sm ${isInStock ? 'text-success' : 'text-error'}`}>
          {isInStock ? `${stockQuantity} in stock` : 'Out of stock'}
        </p>
        
        {/* Action Buttons */}
        <div className="card-actions justify-end mt-auto gap-2">
          <button 
            className="btn btn-primary w-full"
            disabled={!isInStock}
          >
            Add to Cart
          </button>
          <Link 
            to={`/products/${_id}`} 
            className="btn btn-ghost btn-sm"
          >
            Quick View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
