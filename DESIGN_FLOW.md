# MERN Stack Development Flow

# Feature Name

## Requirements
### User Story
"As a [user], I want to [action] so that [benefit]"

### Acceptance Criteria
- [list]

## Technical Design

### Backend Changes
#### Models
- [list]

#### Controllers  
- [list]

#### Routes
- [list]

### Frontend Changes
#### Components
- [list]

#### Services
- [list]


## Pre-Development
1. **Feature Planning**
   - Define feature requirements
   - List all needed components/routes
   - Identify data models needed
   - Plan API endpoints

2. **Database Design**
   - Plan schema structure
   - Define relationships
   - List required fields and types
   - Consider indexes and constraints

## Backend Development Flow
1. **Model Creation** (in `/server/src/models/`)
   ```javascript
   // Example structure:
   const newSchema = new mongoose.Schema({
     field1: { type: String, required: true },
     field2: { type: Number },
     relationships: { type: mongoose.Schema.Types.ObjectId, ref: 'OtherModel' }
   }, { timestamps: true });
   ```

2. **Controller Logic** (in `/server/src/controllers/`)
   - Create CRUD operations
   - Handle business logic
   - Implement error handling
   ```javascript
   // Basic controller structure:
   const controllerFunction = async (req, res) => {
     try {
       // Logic here
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

3. **Route Definition** (in `/server/src/routes/`)
   - Define endpoints
   - Apply middleware
   - Connect to controllers
   ```javascript
   router.get('/', authMiddleware, controllerFunction);
   ```

4. **App Integration** (in `/server/src/app.js`)
   ```javascript
   const newRoutes = require('./routes/new.routes');
   app.use('/api/resource', newRoutes);
   ```

## Frontend Development Flow
1. **Component Creation** (in `/client/src/components/`)
   - Create component file
   - Add state management
   - Implement UI logic
   ```javascript
   const NewComponent = () => {
     const [state, setState] = useState(initial);
     // Component logic
   };
   ```

2. **API Integration** (in `/client/src/services/api.js`)
   ```javascript
   export const newService = {
     getAll: () => fetch(`${API_URL}/resource`),
     create: (data) => fetch(`${API_URL}/resource`, {
       method: 'POST',
       body: JSON.stringify(data)
     })
   };
   ```

3. **Route Addition** (in `/client/src/App.jsx`)
   ```javascript
   <Route path="/new-feature" element={<NewFeature />} />
   ```

## Testing Flow
1. **Backend Testing**
   - Test API endpoints
   - Validate data operations
   - Check error handling

2. **Frontend Testing**
   - Test component rendering
   - Verify user interactions
   - Check API integration

## Documentation
1. **API Documentation**
   ```markdown
   ### Endpoint: /api/resource
   - Method: POST
   - Body: { field1: String, field2: Number }
   - Response: { id: String, ...data }
   ```

2. **Component Documentation**
   ```markdown
   ### Component: NewFeature
   - Props: { prop1, prop2 }
   - State: { state1, state2 }
   - Dependencies: [dep1, dep2]
   ```


# Feature Name

## Requirements
### User Story
"As a [user], I want to [action] so that [benefit]"

### Acceptance Criteria
- [list]

## Technical Design

### Backend Changes
#### Models
- [list]

#### Controllers  
- [list]

#### Routes
- [list]

### Frontend Changes
#### Components
- [list]

#### Services
- [list]

## Example Implementation Checklist
- [ ] Plan feature requirements
- [ ] Design database schema
- [ ] Create backend model
- [ ] Implement controllers
- [ ] Set up routes
- [ ] Create frontend components
- [ ] Add API service methods
- [ ] Test functionality
- [ ] Add documentation

# Feature Development Guide

## Feature Planning Template 