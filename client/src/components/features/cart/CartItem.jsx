import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { productId, quantity, price } = item;

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateQuantity({ productId, quantity: newQuantity });
    }
  };

  const handleIncrement = () => {
    updateQuantity({ productId, quantity: quantity + 1 });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity({ productId, quantity: quantity - 1 });
    }
  };

  const handleRemove = () => {
    removeItem(productId);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {/* Product Image */}
      <Link to={`/products/${productId}`} className="shrink-0">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-24 h-24 object-cover rounded"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <Link 
          to={`/products/${productId}`}
          className="text-lg font-semibold hover:text-primary truncate"
        >
          {item.name}
        </Link>
        <p className="text-base-content/70 text-sm">{item.category}</p>
        <p className="font-medium">${price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="join">
        <button 
          className="btn btn-sm join-item"
          onClick={handleDecrement}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="input input-bordered input-sm w-16 join-item text-center"
          min="1"
        />
        <button 
          className="btn btn-sm join-item"
          onClick={handleIncrement}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <p className="font-semibold">${(price * quantity).toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <button 
        onClick={handleRemove}
        className="btn btn-ghost btn-sm text-error"
        aria-label="Remove item"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;
