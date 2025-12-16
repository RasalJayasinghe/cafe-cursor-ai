# Cafe Cursor - Backend API Documentation

## Overview

This Next.js application includes a built-in backend API using Next.js API Routes. Data is stored in JSON files (can be upgraded to a real database later).

## API Endpoints

### 📦 Orders API

#### Get All Orders

```
GET /api/orders
```

Returns all orders sorted by creation date.

#### Create Order

```
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "orderType": "pickup",  // "pickup" or "dine-in"
  "items": [
    {
      "name": "Cappuccino",
      "quantity": 2,
      "price": 5.99
    }
  ],
  "total": 11.98,
  "status": "pending"  // "pending", "preparing", "ready", "completed", "cancelled"
}
```

#### Get Single Order

```
GET /api/orders/[id]
```

#### Update Order

```
PUT /api/orders/[id]
Content-Type: application/json

{
  "status": "ready"  // Any field can be updated
}
```

#### Delete Order

```
DELETE /api/orders/[id]
```

---

### 🚀 Projects API

#### Get All Projects

```
GET /api/projects
```

Returns all projects sorted by creation date (newest first).

#### Create Project

```
POST /api/projects
Content-Type: application/json

{
  "title": "My Awesome Project",
  "description": "A cool project built at Cafe Cursor",
  "author": "John Doe",
  "githubUrl": "https://github.com/user/repo",  // optional
  "liveUrl": "https://example.com",  // optional
  "tags": ["nextjs", "typescript"],
  "imageUrl": "https://example.com/image.jpg"  // optional
}
```

#### Get Single Project

```
GET /api/projects/[id]
```

#### Update Project

```
PUT /api/projects/[id]
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Like Project

```
PATCH /api/projects/[id]
```

Increments the likes count by 1.

#### Delete Project

```
DELETE /api/projects/[id]
```

---

### 📸 Photos API

#### Get All Photos

```
GET /api/photos
```

Returns all photos sorted by upload date (newest first).

#### Upload Photo

```
POST /api/photos
Content-Type: application/json

{
  "url": "https://example.com/photo.jpg",
  "caption": "Great meetup!",  // optional
  "uploadedBy": "Jane Doe"
}
```

#### Get Single Photo

```
GET /api/photos/[id]
```

#### Like Photo

```
PATCH /api/photos/[id]
```

Increments the likes count by 1.

#### Delete Photo

```
DELETE /api/photos/[id]
```

---

### ❓ Questions API

#### Get All Questions

```
GET /api/questions
```

Returns all questions sorted by ask date (newest first).

#### Ask Question

```
POST /api/questions
Content-Type: application/json

{
  "question": "When is the next Cafe Cursor meetup?",
  "askedBy": "John Doe"
}
```

#### Answer Question

```
PUT /api/questions
Content-Type: application/json

{
  "id": "question_123456789",
  "answer": "The next meetup is on Friday at 6 PM!"
}
```

---

## Data Storage

Currently, data is stored in JSON files in the `data/` directory:

- `data/orders.json`
- `data/projects.json`
- `data/photos.json`
- `data/questions.json`

### Upgrading to a Real Database

To upgrade to PostgreSQL, MongoDB, or other databases:

1. **Install database client:**

```bash
npm install @prisma/client  # for Prisma ORM
# or
npm install pg  # for PostgreSQL
# or
npm install mongodb  # for MongoDB
```

2. **Update `lib/db.ts`** to use database queries instead of JSON files

3. **Keep the same API interface** - no changes needed to API routes!

---

## Testing the API

### Using cURL

```bash
# Get all orders
curl http://localhost:3000/api/orders

# Create an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "orderType": "pickup",
    "items": [{"name": "Coffee", "quantity": 1, "price": 5.99}],
    "total": 5.99,
    "status": "pending"
  }'
```

### Using JavaScript (in browser console or frontend)

```javascript
// Get all projects
const response = await fetch("/api/projects");
const projects = await response.json();
console.log(projects);

// Create a project
const newProject = await fetch("/api/projects", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "My Project",
    description: "Built at Cafe Cursor",
    author: "John Doe",
    tags: ["nextjs"],
  }),
});
const project = await newProject.json();
```

---

## Error Handling

All endpoints return proper HTTP status codes:

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:

```json
{
  "error": "Error message",
  "details": [] // Validation errors (if applicable)
}
```

---

## Next Steps

1. **Add Authentication**: Implement NextAuth.js for user authentication
2. **File Uploads**: Add image upload functionality (use Cloudinary/S3)
3. **Real-time Updates**: Implement WebSockets or Server-Sent Events
4. **Rate Limiting**: Add API rate limiting for production
5. **Database Migration**: Move from JSON to PostgreSQL/MongoDB
6. **Add Middleware**: CORS, logging, error tracking
7. **API Documentation**: Add Swagger/OpenAPI docs
8. **Testing**: Add API tests with Jest/Vitest

---

## File Structure

```
app/
  api/
    orders/
      route.ts           # GET all, POST new
      [id]/
        route.ts         # GET, PUT, DELETE single
    projects/
      route.ts           # GET all, POST new
      [id]/
        route.ts         # GET, PUT, DELETE, PATCH (like)
    photos/
      route.ts           # GET all, POST new
      [id]/
        route.ts         # GET, DELETE, PATCH (like)
    questions/
      route.ts           # GET all, POST new, PUT (answer)
lib/
  db.ts                  # Database functions
  validations.ts         # Zod schemas
data/                    # JSON storage (gitignored)
  orders.json
  projects.json
  photos.json
  questions.json
```
