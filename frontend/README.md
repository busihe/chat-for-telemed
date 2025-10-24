# Chat Support Dashboard - Frontend

A modern, responsive React frontend built with TypeScript, Vite, and TailwindCSS for the Chat Support Dashboard application.

## Features

- **Modern React Stack**: React 18 + TypeScript + Vite
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Dark Mode**: Automatic theme switching with user preference persistence
- **Real-time Messaging**: Socket.IO integration for instant messaging
- **Form Validation**: React Hook Form with custom validation
- **State Management**: Zustand for global state
- **Authentication**: JWT-based authentication with protected routes
- **Role-based Access**: Support for admin, doctor, and patient roles

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── chat/           # Chat-specific components
│   ├── Navbar.tsx      # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useChat.ts      # Chat functionality hook
│   └── useFetch.ts     # Generic API hook
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Chat.tsx        # Chat interface
│   ├── Profile.tsx     # User profile
│   └── NotFound.tsx    # 404 page
├── services/           # API services
│   ├── api.ts          # Axios configuration
│   ├── authService.ts  # Authentication API
│   ├── userService.ts  # User management API
│   ├── chatService.ts  # Chat API
│   └── messageService.ts # Message API
├── stores/             # Zustand stores
│   ├── authStore.ts    # Authentication state
│   ├── chatStore.ts    # Chat state
│   └── themeStore.ts   # Theme state
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── utils/              # Utility functions
│   ├── auth.ts         # Auth helpers
│   ├── validator.ts    # Form validation
│   └── ui.ts           # UI utilities
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Pages

- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration with role selection
- **Dashboard** (`/dashboard`) - Overview with stats and recent activity
- **Chat** (`/chat` & `/chat/:id`) - Real-time messaging interface
- **Profile** (`/profile`) - User profile management
- **404** - Error page for invalid routes

## Components

### UI Components
- **Button** - Configurable button with variants and loading states
- **Input** - Form input with validation and icons
- **Card** - Container component with header, content, footer
- **Loader** - Loading spinner with customizable sizes
- **Modal** - Overlay modal with backdrop
- **Navbar** - Navigation bar with user menu and theme toggle

### Chat Components
- **MessageBubble** - Individual message display
- **MessageInput** - Message composition with typing indicators
- **ConversationList** - Sidebar list of conversations

## Features

### Authentication
- JWT-based authentication
- Role-based access control (admin, doctor, patient)
- Protected routes
- Automatic token refresh
- Persistent login state

### Real-time Chat
- Socket.IO integration
- Instant message delivery
- Typing indicators
- Message read status
- Auto-scroll to latest messages

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized layouts
- Dark/light mode support
- Modern gradient designs
- Smooth animations and transitions

### Form Validation
- Real-time validation
- Custom validation rules
- Error message display
- Role-specific form fields

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL if different
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:4000/api
```

## Demo Credentials

For testing purposes, you can use these credentials:

- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

## Key Features Implementation

### Dark Mode
The application includes a sophisticated dark mode implementation:
- System preference detection
- Manual toggle via navbar
- Persistent preference storage
- Smooth transitions between themes

### State Management
Uses Zustand for clean, TypeScript-friendly state management:
- Authentication state
- Chat state (messages, conversations, typing)
- Theme preferences

### Real-time Features
- Socket.IO integration for instant messaging
- Typing indicators
- Connection status display
- Automatic reconnection

### Responsive Design
- Mobile-first CSS with TailwindCSS
- Breakpoint-specific layouts
- Touch-friendly interface
- Accessible navigation

## Development

### Code Organization
- Feature-based organization
- TypeScript for type safety
- Custom hooks for reusable logic
- Separation of concerns

### Best Practices
- Component composition
- Custom hooks for state logic
- Service layer for API calls
- Utility functions for common operations
- Consistent error handling

## Production Deployment

The application is built for production deployment with:
- Optimized bundle size
- Tree shaking
- Code splitting
- Asset optimization
- Source maps for debugging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on mobile devices
5. Ensure dark mode compatibility