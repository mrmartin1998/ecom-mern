# Cart Management

## Requirements
### User Story
"As a customer, I want to manage my shopping cart so that I can prepare my items for purchase"

### Acceptance Criteria
- [ ] Users can add products to cart
- [ ] Users can view cart contents
- [ ] Users can update product quantities
- [ ] Users can remove items from cart
- [ ] Cart should:
  - Calculate total price
  - Show product availability
  - Persist between sessions
  - Handle out-of-stock items
  - Support guest users
- [ ] Cart syncs when user logs in

## Technical Design

### Backend Changes
#### Models
- Cart Model:
  ```javascript
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    session_id: {
      type: String,
      required: function() { return !this.user; }
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price_at_addition: {
        type: Number,
        required: true
      },
      added_at: {
        type: Date,
        default: Date.now
      }
    }],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    updated_at: {
      type: Date,
      default: Date.now
    },
    expires_at: {
      type: Date,
      required: true
    }
  }
  ```

#### Controllers
- CartController:
  - createCart
    - Handle guest/user carts
    - Generate session ID
  - addToCart
    - Check stock availability
    - Update totals
    - Merge carts if needed
  - updateQuantity
    - Validate stock levels
    - Recalculate totals
  - removeItem
    - Update totals
    - Clean up empty carts
  - getCart
    - Populate product details
    - Check item availability
  - mergeGuestCart
    - Transfer items
    - Handle duplicates
    - Clean up guest cart

#### Routes
- POST /api/cart
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:id
- DELETE /api/cart/items/:id
- POST /api/cart/merge

#### Middleware
- validateCartOperation
- checkProductAvailability
- handleCartExpiration
- syncCartPrices

### Frontend Changes
#### Components
- CartView
  - Item list
  - Quantity controls
  - Price summary
  - Checkout button
- CartItem
  - Product details
  - Quantity selector
  - Remove button
- CartIcon
  - Item count
  - Quick view
- CartSummary
  - Subtotal
  - Item count
  - Action buttons

#### Services
- cartService:
  - Cart operations
  - Price calculations
  - Session management
  - Cart synchronization

### Dependencies
- Authentication System (#1)
- Product CRUD (#4)
- Product Search & Filter (#6)
- Redis Session Store

### Testing Requirements
- Unit Tests:
  - Price calculations
  - Stock validation
  - Cart merging logic
- Integration Tests:
  - Cart operations
  - Session handling
  - Guest cart merging
- E2E Tests:
  - Add/remove flow
  - Quantity updates
  - Cart persistence

### Documentation Updates
- API Documentation:
  - Cart endpoints
  - Session handling
  - Price calculation
- User Guide:
  - Cart features
  - Guest cart behavior
  - Session duration 