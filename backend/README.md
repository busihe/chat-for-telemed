# Chat Support Dashboard

A full-stack real-time chat application with TypeScript, React, Node.js, Express, MongoDB, and Socket.io.

## Features

### Backend (TypeScript)
- **Authentication**: JWT-based auth with role-based access (admin, doctor, patient)
- **Real-time messaging**: Socket.io for instant message delivery
- **REST API**: Complete CRUD operations for users, conversations, and messages
- **Database**: MongoDB with Mongoose ODM
- **Documentation**: Swagger UI at `/api-docs`
- **Security**: Password hashing with bcrypt, CORS enabled

## Tech Stack

### Backend
- Node.js + Express.js (TypeScript)
- MongoDB + Mongoose
- Socket.io
- JWT authentication
- Swagger documentation
- bcrypt, cors, morgan

### Backend Setup
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Admin only)
- `GET /api/users` - List all users

### Conversations
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation

### Messages
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send new message
- `POST /api/messages/read/:conversationId` - Mark messages as read

## Socket Events

### Client → Server
- `joinRoom` - Join a conversation room
- `typing` - Send typing indicator
- `sendMessage` - Send message via socket

### Server → Client
- `receiveMessage` - Receive new message
- `typing` - Receive typing indicator

## Environment Variables

### Backend (.env)
```
PORT=4000
JWT_SECRET=your-super-secret-jwt-key
MONGO_URI=mongodb://127.0.0.1:27017/message_backend
```

## Project Structure

```
├── src/                   # Backend source
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── sockets/           # Socket.io handlers
│   ├── types/             # TypeScript types
│   ├── docs/              # Swagger documentation
│   ├── app.ts             # Express app
│   └── server.ts          # Server entry point

```

## Development

### Backend Development
```bash
npm run dev  # Start with nodemon + ts-node
```

### API Documentation
Visit `http://localhost:4000/api-docs` for Swagger documentation.

## Demo Credentials

For testing, use these demo credentials:
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin


