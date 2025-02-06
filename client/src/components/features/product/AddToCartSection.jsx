import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '@/hooks/useCart';

const AddToCartSection = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading } = useCart();
  const { _id: productId, stockQuantity } = product;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= stockQuantity) {
      setQuantity(value);
    }
  };

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium">
          Quantity:
        </label>
        <div className="join">
          <button 
            className="btn btn-sm join-item"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isLoading}
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            className="input input-bordered input-sm w-20 join-item text-center"
            min="1"
            max={stockQuantity}
          />
          <button 
            className="btn btn-sm join-item"
            onClick={handleIncrement}
            disabled={quantity >= stockQuantity || isLoading}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        className="btn btn-primary w-full"
        onClick={handleAddToCart}
        disabled={stockQuantity === 0 || isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          'Add to Cart'
        )}
      </button>

      {/* Stock Warning */}
      {stockQuantity < 5 && stockQuantity > 0 && (
        <p className="text-warning text-sm">
          Only {stockQuantity} items left in stock!
        </p>
      )}
    </div>
  );
};

AddToCartSection.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    stockQuantity: PropTypes.number.isRequired
  }).isRequired
};

export default AddToCartSection;
