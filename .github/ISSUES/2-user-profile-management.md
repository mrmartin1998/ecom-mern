# User Profile Management

## Requirements
### User Story
"As a user, I want to manage my profile information so that I can keep my account details up to date"

### Acceptance Criteria
- [ ] Users can view their profile details
- [ ] Users can update their:
  - Username
  - Email
  - Password
  - Profile picture (optional)
  - Personal information
- [ ] Users can delete their account
- [ ] All changes require authentication
- [ ] Email changes require verification

## Technical Design

### Backend Changes
#### Models
- Update User Model:  ```javascript
  {
    profile_image: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    preferences: {
      notifications: Boolean,
      newsletter: Boolean
    }
  }  ```

#### Controllers
- ProfileController:
  - getProfile
  - updateProfile
  - updatePassword
  - deleteAccount
  - updateEmail

#### Routes
- GET /api/profile
- PUT /api/profile
- PUT /api/profile/password
- DELETE /api/profile
- PUT /api/profile/email

### Frontend Changes
#### Components
- ProfileLayout
- ProfileForm
- PasswordChangeForm
- DeleteAccountModal
- ImageUploader

#### Services
- profileService:
  - Profile CRUD operations
  - Image upload
  - Email change verification

### Dependencies
- Authentication System ✅ (#1)
- File upload service (for profile images)
- Email service (for verification) 