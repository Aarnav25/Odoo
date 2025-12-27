# GearGuard API Examples

This document provides curl/JavaScript examples for all GearGuard API endpoints.

## Base URL

```
http://localhost:5000/api
```

---

## Users API

### Get All Users

```bash
curl http://localhost:5000/api/users
```

**JavaScript/Fetch:**
```javascript
fetch('http://localhost:5000/api/users')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Single User

```bash
curl http://localhost:5000/api/users/{userId}
```

### Create User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "department": "IT",
    "role": "Technician",
    "avatar": "https://via.placeholder.com/40"
  }'
```

**JavaScript/Axios:**
```javascript
const axios = require('axios');

axios.post('http://localhost:5000/api/users', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  department: 'IT',
  role: 'Technician',
  avatar: 'https://via.placeholder.com/40'
})
.then(res => console.log(res.data))
.catch(err => console.error(err));
```

### Update User

```bash
curl -X PUT http://localhost:5000/api/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "department": "Operations"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/{userId}
```

---

## Equipment API

### Get All Equipment

```bash
curl "http://localhost:5000/api/equipment?department=Production"
```

**Query Parameters:**
- `department`: Filter by department
- `owner`: Filter by owner ID
- `search`: Search by name or serial number

### Get Single Equipment

```bash
curl http://localhost:5000/api/equipment/{equipmentId}
```

### Create Equipment

```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lathe Machine 01",
    "serialNumber": "LATHE-001",
    "category": "Machine",
    "department": "Production",
    "owner": "{userId}",
    "maintenanceTeam": "{teamId}",
    "assignedTechnician": "{technicianId}",
    "purchaseDate": "2023-01-15",
    "warrantyExpiry": "2025-01-15",
    "location": "Production Floor - Section C",
    "notes": "Newly acquired equipment"
  }'
```

### Update Equipment

```bash
curl -X PUT http://localhost:5000/api/equipment/{equipmentId} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Inactive",
    "notes": "Under scheduled maintenance"
  }'
```

### Delete Equipment

```bash
curl -X DELETE http://localhost:5000/api/equipment/{equipmentId}
```

### Get Equipment Maintenance Requests

```bash
curl http://localhost:5000/api/equipment/{equipmentId}/requests
```

**Response includes:**
- Array of all requests for that equipment
- Count of open requests

---

## Maintenance Team API

### Get All Teams

```bash
curl http://localhost:5000/api/teams
```

### Get Single Team

```bash
curl http://localhost:5000/api/teams/{teamId}
```

### Create Team

```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hydraulics Team",
    "description": "Specialized in hydraulic systems",
    "specialty": "Mechanics",
    "members": ["{userId1}", "{userId2}"],
    "teamLead": "{leadUserId}"
  }'
```

### Update Team

```bash
curl -X PUT http://localhost:5000/api/teams/{teamId} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated team description"
  }'
```

### Add Team Member

```bash
curl -X POST http://localhost:5000/api/teams/{teamId}/members \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{newMemberId}"
  }'
```

### Remove Team Member

```bash
curl -X DELETE http://localhost:5000/api/teams/{teamId}/members \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{memberId}"
  }'
```

### Delete Team

```bash
curl -X DELETE http://localhost:5000/api/teams/{teamId}
```

---

## Maintenance Request API

### Get All Requests

```bash
curl "http://localhost:5000/api/requests?stage=New&team={teamId}"
```

**Query Parameters:**
- `stage`: Filter by stage (New, In Progress, Repaired, Scrap)
- `team`: Filter by team ID
- `assignedTo`: Filter by assigned technician ID
- `type`: Filter by type (Corrective, Preventive)
- `search`: Search by subject or description

### Get Single Request

```bash
curl http://localhost:5000/api/requests/{requestId}
```

### Create Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Bearing replacement needed",
    "equipment": "{equipmentId}",
    "requestType": "Corrective",
    "description": "Main spindle bearing shows signs of wear",
    "priority": "High",
    "createdBy": "{userId}",
    "dueDate": "2024-12-30"
  }'
```

**Note:** When creating a request, the system automatically:
- Fills in `equipmentCategory` from equipment record
- Fills in `maintenanceTeam` from equipment record
- Sets `stage` to "New"

### Update Request

```bash
curl -X PUT http://localhost:5000/api/requests/{requestId} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated issue description",
    "priority": "Critical"
  }'
```

### Update Stage (Kanban Drag & Drop)

```bash
curl -X PUT http://localhost:5000/api/requests/{requestId}/stage \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "In Progress"
  }'
```

**Valid stages:**
- New
- In Progress
- Repaired
- Scrap

**Note:** Moving to "Scrap" automatically sets equipment status to "Scrapped"

### Assign Request to Technician

```bash
curl -X PUT http://localhost:5000/api/requests/{requestId}/assign \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{technicianId}"
  }'
```

**Note:** This also automatically changes stage to "In Progress"

### Complete Request

```bash
curl -X PUT http://localhost:5000/api/requests/{requestId}/complete \
  -H "Content-Type: application/json" \
  -d '{
    "durationHours": 3.5,
    "completionNotes": "Replaced bearing assembly. Machine tested successfully."
  }'
```

**Note:** This automatically changes stage to "Repaired"

### Get Requests by Equipment

```bash
curl http://localhost:5000/api/requests/equipment/{equipmentId}
```

**Response includes:**
- Array of all requests for that equipment
- Count of open requests

### Get Calendar Requests (Preventive Only)

```bash
curl http://localhost:5000/api/requests/calendar/events
```

Returns all Preventive requests with scheduled dates.

### Get Statistics

```bash
curl http://localhost:5000/api/requests/stats/all
```

**Response includes:**
- Total requests
- Open requests count
- Completed requests count
- Scrapped requests count
- Requests per team
- Requests per category

### Delete Request

```bash
curl -X DELETE http://localhost:5000/api/requests/{requestId}
```

---

## JavaScript Examples

### Using Axios in Frontend

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create all requests with filters
axios.get(`${API_BASE}/requests?stage=New`)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// Create a new request
axios.post(`${API_BASE}/requests`, {
  subject: 'Machine maintenance',
  equipment: 'equipment_id',
  requestType: 'Corrective',
  createdBy: 'user_id'
})
  .then(res => console.log('Request created:', res.data))
  .catch(err => console.error(err));

// Update request stage
axios.put(`${API_BASE}/requests/{requestId}/stage`, {
  stage: 'In Progress'
})
  .then(res => console.log('Stage updated:', res.data))
  .catch(err => console.error(err));

// Assign request
axios.put(`${API_BASE}/requests/{requestId}/assign`, {
  userId: 'technician_id'
})
  .then(res => console.log('Assigned:', res.data))
  .catch(err => console.error(err));

// Complete request
axios.put(`${API_BASE}/requests/{requestId}/complete`, {
  durationHours: 2.5,
  completionNotes: 'Work completed successfully'
})
  .then(res => console.log('Completed:', res.data))
  .catch(err => console.error(err));
```

### Using Fetch API

```javascript
const API_BASE = 'http://localhost:5000/api';

// GET request
fetch(`${API_BASE}/equipment`)
  .then(res => res.json())
  .then(data => console.log(data));

// POST request
fetch(`${API_BASE}/requests`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    subject: 'Machine maintenance',
    equipment: 'equipment_id',
    requestType: 'Preventive',
    createdBy: 'user_id'
  })
})
  .then(res => res.json())
  .then(data => console.log('Created:', data));

// PUT request
fetch(`${API_BASE}/requests/{requestId}/stage`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    stage: 'In Progress'
  })
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data));
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Error message describing what went wrong"
}
```

### 404 Not Found

```json
{
  "message": "Equipment not found"
}
```

### 500 Server Error

```json
{
  "message": "Internal server error message"
}
```

---

## Testing the API

### Using Postman

1. Import the API Base URL: `http://localhost:5000/api`
2. Create requests for each endpoint
3. Set method (GET, POST, PUT, DELETE)
4. Add JSON body for POST/PUT requests
5. Send and view responses

### Using Command Line

All examples above work with curl. Make sure MongoDB and the backend server are running.

---

## Common Workflow Examples

### Complete Maintenance Workflow

1. **Create Request**
   ```bash
   curl -X POST http://localhost:5000/api/requests \
     -H "Content-Type: application/json" \
     -d '{
       "subject": "Urgent repair",
       "equipment": "{equipmentId}",
       "requestType": "Corrective",
       "priority": "High",
       "createdBy": "{userId}"
     }'
   ```

2. **Assign Technician**
   ```bash
   curl -X PUT http://localhost:5000/api/requests/{requestId}/assign \
     -H "Content-Type: application/json" \
     -d '{"userId": "{technicianId}"}'
   ```

3. **Move to In Progress** (automatic with assign)
   - Done automatically when assigned

4. **Complete Work**
   ```bash
   curl -X PUT http://localhost:5000/api/requests/{requestId}/complete \
     -H "Content-Type: application/json" \
     -d '{
       "durationHours": 2.5,
       "completionNotes": "Work completed"
     }'
   ```

5. **View Updated Request**
   ```bash
   curl http://localhost:5000/api/requests/{requestId}
   ```

---

For more details on request/response format, check the database models in `backend/models/`.
