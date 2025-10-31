
# EduMate Backend 

**Campus Connect App - Educational Platform Backend**

A robust Node.js/Express backend API for the EduMate application, providing authentication, user management, and social post management for educational institutions.

**Live API:** https://edu-mate-app-back-end.vercel.app

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Database Models](#-database-models)
- [Middleware](#-middleware)
- [Error Handling](#-error-handling)
- [Deployment](#-deployment)

---

## ✨ Features

### User Management
- ✅ User registration with email & username validation
- ✅ Secure login with JWT authentication
- ✅ User profile retrieval
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Student, Society Head)

### Post Management
- ✅ Create posts (News & Events)
- ✅ Retrieve posts with filtering & pagination
- ✅ Update own posts
- ✅ Delete own posts
- ✅ Get individual post details
- ✅ Post categorization by type

### Security
- ✅ JWT token-based authentication
- ✅ Role-based authorization middleware
- ✅ Password encryption
- ✅ Protected API endpoints
- ✅ CORS support

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Vercel** | Deployment platform |
| **CORS** | Cross-origin resource sharing |

---

## 📁 Project Structure

```
EduMateApp-BACKEnd/
├── config/
│   └── db.js                    # MongoDB connection setup
├── controllers/
│   ├── userController.js        # User registration, login, profile
│   └── postController.js        # Post CRUD operations
├── middleware/
│   ├── authMiddleware.js        # JWT verification
│   └── roleMiddleware.js        # Role-based access control
├── models/
│   ├── User.js                  # User schema
│   └── post.js                  # Post schema
├── routes/
│   ├── userRoutes.js            # User endpoints
│   └── postRoutes.js            # Post endpoints
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── vercel.json                  # Vercel deployment config
└── .gitignore                   # Git ignore rules
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v14+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/akash-kabir/EduMateApp-BACKEnd.git
cd EduMateApp-BACKEnd
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
# Copy the environment template
cp .env.example .env  # or create manually (see Environment Variables)
```

4. **Configure environment variables** (see section below)

5. **Start the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start

# Server will run on: http://localhost:5000
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edumate?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### Important Notes:
- **MONGO_URI**: Get this from MongoDB Atlas → Connect → Connection String
- **JWT_SECRET**: Use a strong, random string (minimum 32 characters)
- **NODE_ENV**: Set to `production` when deploying

---

## 📡 API Endpoints

### Base URL
```
https://edu-mate-app-back-end.vercel.app/api
```

### User Endpoints

#### 1. Register User
```http
POST /users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

#### 2. Login User
```http
POST /users/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

#### 3. Get User Profile
```http
GET /users/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "Student"
}
```

#### 4. Society Head Access
```http
GET /users/society
Authorization: Bearer <token>
```

**Response (200):** *(Only for society_head role)*
```json
{
  "message": "Welcome Society Head! You have special access."
}
```

---

### Post Endpoints

#### 1. Create Post *(Society Head Only)*
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "postType": "event",
  "heading": "Tech Fest 2025",
  "body": "Join us for the annual tech festival with workshops and competitions.",
  "location": {
    "campus": "Main Campus",
    "floor": "3",
    "roomNo": "301"
  },
  "eventDetails": {
    "startDate": "2025-12-15",
    "endDate": "2025-12-17",
    "startTime": "09:00",
    "endTime": "17:00",
    "isDateRange": true,
    "isTimeRange": true
  }
}
```

**Alternative - News Post:**
```json
{
  "postType": "news",
  "heading": "Campus Updates",
  "body": "New cafeteria is now open in block A.",
  "location": {},
  "eventDetails": {}
}
```

**Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "507f1f77bcf86cd799439011",
    "postType": "event",
    "heading": "Tech Fest 2025",
    "body": "Join us for the annual tech festival...",
    "author": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "authorUsername": "johndoe",
    "location": { "campus": "Main Campus", "floor": "3", "roomNo": "301" },
    "eventDetails": { ... },
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

#### 2. Get All Posts
```http
GET /posts?postType=event&limit=20&skip=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `postType` (optional): Filter by 'news' or 'event'
- `limit` (optional, default: 50): Number of posts to return
- `skip` (optional, default: 0): Number of posts to skip

**Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "postType": "event",
      "heading": "Tech Fest 2025",
      "body": "...",
      "author": { ... },
      "authorUsername": "johndoe",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### 3. Get Post by ID
```http
GET /posts/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "post": {
    "_id": "507f1f77bcf86cd799439011",
    "postType": "event",
    "heading": "Tech Fest 2025",
    ...
  }
}
```

#### 4. Update Post *(Own posts only)*
```http
PUT /posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "heading": "Updated Tech Fest 2025",
  "body": "Updated description..."
}
```

**Response (200):**
```json
{
  "message": "Post updated successfully",
  "post": { ... }
}
```

#### 5. Delete Post *(Own posts only)*
```http
DELETE /posts/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

---

## 🔒 Authentication

### How JWT Authentication Works

1. **User registers/logs in** → Backend generates JWT token
2. **Token returned** → Client stores token in SharedPreferences
3. **API requests** → Client includes token in Authorization header
4. **Server validates** → Middleware verifies token and extracts user info
5. **Request proceeds** → If valid, user attached to request object

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMCIsImlhdCI6MTcxMDc1MjYwMCwiZXhwIjoxNzExMzU3NDAwfQ.signature
```

### Token Expiration
- Default expiration: **7 days**
- Configurable in `userController.js`

---

## 📊 Database Models

### User Schema

```javascript
{
  firstName: String (required),
  lastName: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  role: String (default: "Student", enum: ["Student", "society_head"]),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Post Schema

```javascript
{
  postType: String (enum: ["news", "event"], required),
  heading: String (required, trimmed),
  body: String (required),
  location: {
    campus: String,
    floor: String,
    roomNo: String
  },
  eventDetails: {
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    isDateRange: Boolean (default: false),
    isTimeRange: Boolean (default: false)
  },
  author: ObjectId (ref: "User", required),
  authorUsername: String (required),
  createdAt: Date (auto, indexed -1),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `createdAt: -1` → For sorting posts by newest first
- `postType: 1` → For filtering posts by type

---

## 🛡 Middleware

### Authentication Middleware (`authMiddleware.js`)

Verifies JWT token in Authorization header and attaches user to request object.

```javascript
// Usage in routes:
router.get('/me', protect, getProfile);
```

**What it does:**
1. Checks for `Authorization: Bearer <token>` header
2. Verifies token signature using `JWT_SECRET`
3. Decodes token and fetches user from database
4. Attaches user to `req.user`
5. Passes to next middleware/controller

**Error handling:**
- 401: Missing token
- 401: Invalid/expired token

### Role Middleware (`roleMiddleware.js`)

Checks if user has required role(s) for resource access.

```javascript
// Usage in routes:
router.post('/', protect, checkRole(['society_head']), createPost);
```

**What it does:**
1. Checks `req.user.role` against allowed roles array
2. Returns 403 Forbidden if role not authorized
3. Proceeds if authorized

**Error handling:**
- 403: User lacks required role

---

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Additional error details (if available)"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET request succeeded |
| 201 | Created | User registered / Post created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Post not found |
| 500 | Server Error | Database error |

### Common Error Scenarios

**User already exists:**
```json
{ "message": "User already exists" }
```

**Invalid credentials:**
```json
{ "message": "Invalid credentials" }
```

**Missing required fields:**
```json
{ "message": "Post type, heading, and body are required" }
```

**Unauthorized to update:**
```json
{ "message": "Not authorized to update this post" }
```

---

## 🌐 Deployment

### Vercel Deployment

The backend is deployed on **Vercel** with serverless functions.

#### Deployment Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### Deploy Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy from repository root**
```bash
vercel
```

3. **Set environment variables in Vercel Dashboard**
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV=production

4. **Verify deployment**
```bash
curl https://edu-mate-app-back-end.vercel.app/
```

#### Environment Setup for Production

Before deploying, ensure:
- ✅ `MONGO_URI` points to MongoDB Atlas (cloud database)
- ✅ `JWT_SECRET` is strong and unique
- ✅ `.env` file is in `.gitignore` (don't commit secrets)
- ✅ `NODE_ENV=production` for Vercel

---

## 📚 API Usage Examples

### JavaScript/Dart Frontend Integration

```dart
// Example: Register User
final response = await http.post(
  Uri.parse('https://edu-mate-app-back-end.vercel.app/api/users/register'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'firstName': 'John',
    'lastName': 'Doe',
    'username': 'johndoe',
    'email': 'john@example.com',
    'password': 'password123'
  }),
);

final data = jsonDecode(response.body);
final token = data['token'];

// Example: Create Post with Authentication
final postResponse = await http.post(
  Uri.parse('https://edu-mate-app-back-end.vercel.app/api/posts'),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token'
  },
  body: jsonEncode({
    'postType': 'event',
    'heading': 'Tech Fest 2025',
    'body': 'Join us for workshops and competitions',
    'location': {'campus': 'Main Campus'},
    'eventDetails': {'startDate': '2025-12-15'}
  }),
);
```

---

## 📝 License

This project is part of the EduMate application developed for educational institutions.

---

## 👨‍💻 Author

**Akash Kabir**
- GitHub: [@akash-kabir](https://github.com/akash-kabir)
- Repository: [EduMateApp-BACKEnd](https://github.com/akash-kabir/EduMateApp-BACKEnd)

---

## 📞 Support & Feedback

For issues, bug reports, or feature requests, please open an issue on the GitHub repository.

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | Jan 2025 | Initial release with user auth and post management |

---

**Last Updated:** October 31, 2025  
**Status:** ✅ Production Ready
