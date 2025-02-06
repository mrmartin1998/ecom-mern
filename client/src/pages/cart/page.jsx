import React from 'react';
import { useCart } from '@/hooks/useCart';
import EmptyCart from '@/components/features/cart/EmptyCart';
//import CartSummary from '@/components/features/cart/CartSummary';
//import CartTotals from '@/components/features/cart/CartTotals';

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
        {/* <div className="lg:col-span-8">
          <CartSummary cart={cart} />
        </div>
        <div className="lg:col-span-4">
          <CartTotals cart={cart} />
        </div> */}
      </div>
    </div>
  );
};

export default CartPage;
