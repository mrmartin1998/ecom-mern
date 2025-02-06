import { useCart } from '@/hooks/useCart';
    import { formatCurrency } from '@/utils/formatters';

const CartTotals = () => {
  const { cart } = useCart();

  if (!cart) return null;

  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      {/* Subtotal */}
      <div className="flex justify-between mb-2">
        <span className="text-base-content/70">Subtotal</span>
        <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
      </div>
      
      {/* Shipping - We can add this later when we implement shipping */}
      <div className="flex justify-between mb-2">
        <span className="text-base-content/70">Shipping</span>
        <span className="text-success">Free</span>
      </div>
      
      {/* Divider */}
      <div className="divider my-4"></div>
      
      {/* Total */}
      <div className="flex justify-between mb-6">
        <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">{formatCurrency(cart.totalPrice)}</span>
      </div>
      
      {/* Checkout Button */}
      <button 
        className="btn btn-primary w-full"
        onClick={() => {/* We'll implement checkout later */}}
      >
        Proceed to Checkout
      </button>
      
      {/* Additional Info */}
      <p className="text-sm text-base-content/70 text-center mt-4">
        Shipping & taxes calculated at checkout
      </p>
    </div>
  );
};

export default CartTotals;
