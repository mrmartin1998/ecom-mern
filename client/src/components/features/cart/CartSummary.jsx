import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const CartSummary = () => {
  const { cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-base-content/70">Your cart is empty</p>
      </div>
    );
  }

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="p-4 min-w-[320px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Shopping Cart</h3>
        <span className="text-sm text-base-content/70">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items List - Show only first 3 items */}
      <div className="space-y-3 mb-4">
        {cart.items.slice(0, 3).map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-base-200 rounded">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-sm text-base-content/70">
                {item.quantity} × {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        ))}
        {cart.items.length > 3 && (
          <p className="text-sm text-base-content/70 text-center">
            and {cart.items.length - 3} more items...
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center font-semibold mb-4">
        <span>Total</span>
        <span>{formatCurrency(cart.totalPrice)}</span>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Link 
          to={ROUTES.CART}
          className="btn btn-primary w-full"
        >
          View Cart
        </Link>
        <Link 
          to={ROUTES.CHECKOUT}
          className="btn btn-secondary w-full"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
