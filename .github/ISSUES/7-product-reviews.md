# Product Reviews

## Requirements
### User Story
"As a customer, I want to share my experience with products so that other customers can make informed purchasing decisions"

### Acceptance Criteria
- [ ] Authenticated users can create product reviews
- [ ] Reviews must include:
  - Rating (1-5 stars)
  - Written review (optional)
  - Purchase verification badge (if applicable)
- [ ] Users can:
  - Edit their reviews
  - Delete their reviews
  - View their review history
- [ ] Admin can moderate reviews
- [ ] Product pages display:
  - Average rating
  - Rating distribution
  - Review count
  - Verified purchase badge
- [ ] Reviews support pagination and sorting

## Technical Design

### Backend Changes
#### Models
- Review Model:  ```javascript
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review_text: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    is_verified_purchase: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    helpful_votes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  }  ```

#### Controllers
- ReviewController:
  - createReview
    - Verify user authentication
    - Check purchase history
    - Handle rating calculation
  - updateReview
    - Validate ownership
    - Update product ratings
  - deleteReview
    - Validate ownership
    - Recalculate product ratings
  - getProductReviews
    - Pagination
    - Sorting options
    - Filter options
  - getUserReviews
    - Review history
  - moderateReview
    - Admin only
    - Status management

#### Routes
- POST /api/products/:id/reviews
- PUT /api/reviews/:id
- DELETE /api/reviews/:id
- GET /api/products/:id/reviews
- GET /api/users/reviews
- PATCH /api/admin/reviews/:id/status

#### Middleware
- validateReview
- checkReviewOwnership
- checkModeratorPermission
- calculateProductRating

### Frontend Changes
#### Components
- ReviewForm
  - Star rating input
  - Review text editor
  - Submission feedback
- ReviewList
  - Review cards
  - Pagination controls
  - Sort controls
- ReviewStats
  - Rating distribution
  - Average rating display
  - Review count
- UserReviews
  - Review history
  - Edit/Delete options
- AdminReviewModeration
  - Review queue
  - Moderation actions
  - Status updates

#### Services
- reviewService:
  - Review CRUD operations
  - Rating calculations
  - Moderation functions
  - Analytics tracking

### Dependencies
- Authentication System (#1)
- User Profile Management (#2)
- Admin Dashboard (#3)
- Product CRUD (#4)
- Product Search & Filter (#6)

### Testing Requirements
- Unit Tests:
  - Rating calculations
  - Review validation
  - Permission checks
- Integration Tests:
  - Review CRUD operations
  - Rating updates
  - Moderation flow
- E2E Tests:
  - Review submission
  - Edit/Delete flow
  - Moderation process

### Documentation Updates
- API Documentation:
  - Review endpoints
  - Rating calculations
  - Moderation rules
- User Guide:
  - Review guidelines
  - Rating system
  - Moderation policies 