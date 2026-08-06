# BMS — Bookmark Manager App

A full-stack bookmark manager built with React, Node.js, Express, and MongoDB. Save, organize, and manage your links across custom and preset categories.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt

---

## Features

### Completed
- User registration with duplicate check and password hashing
- User login with password verification
- Input validation utilities
- REST API structure with versioned routes (`/api/v1/`)
- Mongoose schemas for users, saved links, and custom categories
- Register and Login UI
- Dashboard UI for saving and viewing links

### In Progress
- JWT token generation and auth middleware
- Save / edit / delete link functionality
- Frontend routing between pages
- Dashboard connected to live API data
- Logout

---

## Project Structure

```
BMS-APP/
├── Backend/
│   ├── Controllers/
│   │   ├── User.controller.js       # Register, Login, UserProfile
│   │   └── Linkdata.controller.js   # SaveLinks, EditLinksandTag
│   ├── Routes/
│   │   ├── User.routes.js
│   │   └── Linkdata.routes.js
│   ├── MongoDB/
│   │   ├── Models/
│   │   │   ├── UserSchema.js
│   │   │   └── Urlschema.js
│   │   └── Connection.js
│   ├── Utils/
│   │   ├── AsyncHandler.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── Validation.js
│   ├── app.js
│   └── server.js
│
└── Frontend/
    └── BMS/
        ├── src/
        │   ├── App.jsx
        │   ├── Dashboard.jsx
        │   └── index.css
        └── Auth/
            ├── Register.jsx
            └── Login.jsx
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login existing user |
| GET | `/api/v1/users/userprofile` | Get user profile |
| POST | `/api/v1/Linkdata/Mainpage` | Save a new link |
| PATCH | `/api/v1/Linkdata/Editpage` | Edit a link or tag |

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

Start the server:

```bash
node server.js
```

### Frontend Setup

```bash
cd Frontend/BMS
npm install
npm run dev
```

---

## Status

This project is actively under development. Core authentication is functional. Link management and frontend routing are currently being implemented.
