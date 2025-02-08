# Category Management

## Requirements
### User Story
"As an admin, I want to manage product categories so that products can be organized and easily browsed by customers"

### Acceptance Criteria
- [ ] Admin can create categories
- [ ] Admin can view category list
- [ ] Admin can update category details
- [ ] Admin can delete categories (if no products attached)
- [ ] Categories must include:
  - Name
  - Description (optional)
  - Parent category (optional)
  - Status (active/inactive)
  - Image (optional)

## Technical Design

### Backend Changes
#### Models
- Category Model:  ```javascript
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      unique: true
    },
    description: { 
      type: String,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    image: {
      url: String,
      alt: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
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
- CategoryController:
  - createCategory
    - Generate slug
    - Validate unique name
    - Handle image upload
  - getCategories
    - Tree structure option
    - Pagination
    - Filter by status
  - getCategoryById
    - Include product count
    - Include subcategories
  - updateCategory
    - Update slug if name changes
    - Handle image updates
  - deleteCategory
    - Check for products
    - Check for subcategories

#### Routes
- POST /api/categories
- GET /api/categories
- GET /api/categories/:id
- PUT /api/categories/:id
- DELETE /api/categories/:id
- GET /api/categories/tree

#### Middleware
- validateCategory
- handleCategoryImage
- checkCategoryExists
- checkAdminPermission
- preventCircularParent

### Frontend Changes
#### Components
- CategoryForm
  - Parent category selector
  - Image upload/preview
  - Validation feedback
- CategoryList
  - Tree view
  - List view toggle
  - Quick status update
- CategoryDetail
  - Product count
  - Subcategories list
  - Usage statistics

#### Services
- categoryService:
  - Category CRUD operations
  - Image handling
  - Tree structure management

### Dependencies
- Authentication System (#1)
- Admin Dashboard (#3)
- Product CRUD (#4)
- File Storage Service

### Testing Requirements
- Unit Tests:
  - Model validation
  - Slug generation
  - Tree structure
- Integration Tests:
  - CRUD operations
  - Image handling
  - Parent-child relationships
- E2E Tests:
  - Category management flow
  - Tree view interactions

### Documentation Updates
- API Documentation:
  - Endpoint specifications
  - Tree structure format
- Admin Guide:
  - Category management
  - Image guidelines
  - Best practices for hierarchy 