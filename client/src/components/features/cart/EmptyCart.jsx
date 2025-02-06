import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-base-200 rounded-full p-6 mb-6">
        <ShoppingCartIcon className="h-12 w-12 text-primary" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">
        Your cart is empty
      </h2>
      
      <p className="text-base-content/70 text-center mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. 
        Browse our products and find something you like!
      </p>
      
      <Link 
        to={ROUTES.PRODUCTS}
        className="btn btn-primary"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
