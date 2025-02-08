# Inventory Management

## Requirements
### User Story
"As an admin, I want to manage product inventory so that stock levels are accurately tracked and maintained"

### Acceptance Criteria
- [ ] Admin can:
  - View current stock levels
  - Update stock quantities
  - Set low stock thresholds
  - View stock history
  - Generate inventory reports
- [ ] System should:
  - Track stock changes
  - Auto-update on orders
  - Alert on low stock
  - Prevent overselling
  - Log inventory changes
- [ ] Support for:
  - Bulk updates
  - Stock adjustments
  - Inventory counts
  - Stock forecasting

## Technical Design

### Backend Changes
#### Models
- InventoryTransaction Model:
  ```javascript
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        'purchase',
        'sale',
        'adjustment',
        'return',
        'loss',
        'count'
      ],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    previous_quantity: {
      type: Number,
      required: true
    },
    new_quantity: {
      type: Number,
      required: true
    },
    reference: {
      type: String,
      enum: ['order', 'manual', 'system'],
      required: true
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'reference_model'
    },
    reference_model: {
      type: String,
      enum: ['Order', 'User', 'System']
    },
    note: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }
  ```

#### Services
- inventoryService:
  - Stock management
  - Transaction logging
  - Alert generation
  - Report creation
- stockAlertService:
  - Threshold monitoring
  - Email notifications
  - Dashboard alerts

#### Routes
- GET /api/inventory/products
- GET /api/inventory/product/:id
- PATCH /api/inventory/product/:id/stock
- POST /api/inventory/bulk-update
- GET /api/inventory/transactions
- GET /api/inventory/alerts
- GET /api/inventory/reports

#### Middleware
- validateStockUpdate
- logInventoryChange
- checkStockThreshold
- preventOverselling

### Frontend Changes
#### Components
- InventoryDashboard
  - Stock overview
  - Alert notifications
  - Quick actions
- StockManager
  - Product list
  - Stock updates
  - History view
- InventoryReports
  - Stock levels
  - Transaction history
  - Forecasting
- AlertSettings
  - Threshold config
  - Notification setup
  - Alert history

#### Services
- inventoryClientService:
  - Stock operations
  - Report generation
  - Alert management
  - History tracking

### Dependencies
- Product CRUD (#4)
- Order Management (#10)
- Email Notification System (#14)
- Admin Dashboard (#3)

### Testing Requirements
- Unit Tests:
  - Stock calculations
  - Alert thresholds
  - Transaction logging
- Integration Tests:
  - Inventory updates
  - Order processing
  - Alert generation
- E2E Tests:
  - Stock management
  - Report generation
  - Alert system

### Documentation Updates
- API Documentation:
  - Inventory endpoints
  - Transaction types
  - Alert system
- Admin Guide:
  - Stock management
  - Report interpretation
  - Alert configuration
- Technical Guide:
  - Transaction logging
  - Stock calculations
  - Alert mechanisms 