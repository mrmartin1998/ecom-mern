import React from 'react';
import { useCart } from '@/hooks/useCart';
import EmptyCart from '@/components/features/cart/EmptyCart';
import CartItem from '@/components/features/cart/CartItem';
import CartTotals from '@/components/features/cart/CartTotals';
import CartSummary from '@/components/features/cart/CartSummary';

const CartPage = () => {
  const { cart, isLoadingCart } = useCart();

  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Cart Section */}
        <div className="lg:col-span-8">
          <div className="bg-base-100 rounded-lg shadow-sm p-6">
            {cart.items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <CartTotals />
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
