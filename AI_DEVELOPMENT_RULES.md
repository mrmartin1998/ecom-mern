# AI Development Rules

## 1. Documentation Order
1. Start with PRD.md review/update
   Example: When adding a new feature, first check PRD.md requirements:
   ```markdown
   ### User Management System
   - User registration and authentication
   - Role-based access (Admin/Customer)
   ```

2. Update FEATURE_PLANNING.md based on PRD
   Example: Break down the feature into tasks:
   ```markdown
   ### Authentication System (Issue #1)
   #### Technical Tasks
   1. Backend:
      - [ ] Update User model
      - [ ] Implement JWT auth
   ```

3. Use DESIGN_FLOW.md template for each feature
   Example: Document technical implementation:
   ```markdown
   ## Technical Design
   ### Backend Changes
   - Model: Add role field to User
   - Controller: Add role validation
   ```

## 2. Focus Rules
- Stay on current task until completion
  Example: Complete all authentication tasks before starting product features
- No code suggestions for unrelated features
  Example: Don't suggest cart features while working on auth
- Reference only relevant documentation
  Example: When working on user auth, reference:
  - @server/src/models/user.model.js
  - @server/src/controllers/auth.controller.js

## 3. Development Process
1. Planning Phase
   ```markdown
   - Review: Check PRD.md for requirements
   - Plan: Create DESIGN_FLOW.md entry
   - Document: Update FEATURE_PLANNING.md
   ```

2. Implementation Phase
   ```javascript
   // Example: Follow established patterns
   const userSchema = new mongoose.Schema({
     email: { type: String, required: true },
     role: { type: String, enum: ['user', 'admin'] }
   });
   ```

## 4. Documentation Requirements
- Use @notation for file references
  Example: @server/src/models/user.model.js
- Track progress in version-1.0.0.md
  Example:
  ```markdown
  ## Progress
  - [x] User Model
  - [ ] Authentication
  ```

## 5. Issue Management
- Create specific, actionable issues
  Example:
  ```markdown
  Title: [AUTH] Implement JWT Authentication
  Tasks:
  - [ ] Add JWT middleware
  - [ ] Create token generation
  ```

## 6. Communication Protocol
- Confirm current task
  Example: "Currently working on user authentication, specifically JWT implementation"
- Report completion
  Example: "Completed: JWT middleware implementation, ready for review"

## 7. Error Prevention
- Validate existing code
  Example: Check auth.middleware.js before modifying auth flow
- Test edge cases
  Example:
  ```javascript
  // Test invalid token
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  ```

## 8. Progress Tracking
- Start with status
  Example: "Current: Implementing user authentication (70% complete)"
- End with summary
  Example: "Completed: JWT middleware, Next: Password reset"

## 9. Code Organization
- Follow patterns
  Example:
  ```javascript
  // Controller pattern
  const controllerName = async (req, res) => {
    try {
      // Logic
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

## 10. Testing Requirements
- Unit test critical paths
  Example:
  ```javascript
  describe('Auth Middleware', () => {
    it('should validate JWT token', () => {
      // Test code
    });
  });
  ```

## 11. Security Practices
- Always validate input
  Example:
  ```javascript
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  ``` 