# Product CRUD Operations

## Requirements
### User Story
"As an admin, I want to manage product listings so that customers can browse and purchase items"

### Acceptance Criteria
- [ ] Admin can create new products
- [ ] Admin can view product listings
- [ ] Admin can update product details
- [ ] Admin can delete products
- [ ] Products must include:
  - Name, description, price
  - Category
  - Stock quantity
  - Images
  - Status (active/inactive)

## Technical Design

### Backend Changes
#### Models
- Product Model:  ```javascript
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true
    },
    stock: { 
      type: Number, 
      required: true,
      min: 0,
      default: 0
    },
    images: [{ 
      url: String,
      alt: String
    }],
    status: { 
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft'
    },
    sku: { 
      type: String, 
      unique: true 
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updated_at: { 
      type: Date,
      default: Date.now 
    }
  }  ```

#### Controllers
- ProductController:
  - createProduct
    - Validate input
    - Handle image uploads
    - Generate SKU
    - Create product record
  - getProducts
    - Pagination
    - Filtering
    - Sorting
  - getProductById
    - Populate category
    - Handle not found
  - updateProduct
    - Validate changes
    - Handle image updates
    - Update timestamps
  - deleteProduct
    - Soft delete option
    - Check dependencies

#### Routes
- POST /api/products
- GET /api/products
- GET /api/products/:id
- PUT /api/products/:id
- DELETE /api/products/:id
- PATCH /api/products/:id/status
- PATCH /api/products/:id/stock

#### Middleware
- validateProduct
- handleImageUpload
- checkProductExists
- checkAdminPermission

### Frontend Changes
#### Components
- ProductForm
  - Image upload/preview
  - Category selection
  - Rich text editor
  - Validation
- ProductList
  - Pagination
  - Sorting
  - Filtering
- ProductDetail
  - Image gallery
  - Edit/Delete actions
- StockManager
  - Quick stock updates
  - Low stock alerts

#### Services
- productService:
  - Product CRUD operations
  - Image upload handling
  - Stock management
  - Category integration

### Dependencies
- Authentication System (#1)
- Admin Dashboard (#3)
- Category Management (#5)
- File Storage Service
- Image Processing Service

### Testing Requirements
- Unit Tests:
  - Model validation
  - Controller logic
  - Route protection
- Integration Tests:
  - CRUD operations
  - Image uploads
  - Admin permissions
- E2E Tests:
  - Product management flow
  - Image handling
  - Stock updates

### Documentation Updates
- API Documentation:
  - Endpoint specifications
  - Request/Response formats
- Admin Guide:
  - Product management
  - Image guidelines
  - SKU format