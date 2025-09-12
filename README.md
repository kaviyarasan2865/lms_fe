# LMS Frontend - NEET PG Preparation Platform

This is the frontend application for the Learning Management System designed specifically for NEET PG preparation students.

## Features

- **Authentication**: Secure login/logout with NextAuth.js
- **Role-based Access Control**: Different access levels for Product Owners, College Admins, Faculty, and Students
- **Admin Dashboard**: Comprehensive management interface for college administrators
- **Session Management**: Secure JWT token handling with automatic refresh
- **Route Protection**: Middleware-based route protection based on user roles

## Tech Stack

- **Next.js 15**: React framework with App Router
- **NextAuth.js**: Authentication and session management
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React 19**: Latest React features

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Authentication Flow

### User Roles

1. **Product Owner**: Manages multiple colleges
2. **College Admin**: Manages their specific college (batches, students, faculty, etc.)
3. **Faculty**: Creates questions and manages quizzes
4. **Student**: Takes tests and views results

### Login Process

1. User enters username and password
2. Credentials are sent to Django backend for validation
3. JWT tokens are returned and stored in NextAuth session
4. User is redirected to appropriate dashboard based on role

### Route Protection

- `/login` and `/register`: Public routes
- `/admin-dashboard/*`: Requires college_admin or product_owner role
- `/unauthorized`: Shown when user lacks required permissions

## API Integration

The frontend communicates with the Django backend through:

- **Authentication**: `/api/login/`, `/api/logout/`, `/api/register/`
- **User Management**: `/api/profile/`
- **College Management**: `/api/colleges/`
- **Batch Management**: `/api/batches/`
- **Student Management**: `/api/students/`
- **Faculty Management**: `/api/faculties/`
- **Subject Management**: `/api/subjects/`
- **Question Bank**: `/api/questions/`

## Project Structure

```
src/
├── app/
│   ├── (admin)/
│   │   ├── admin-dashboard/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   └── auth/
│   └── unauthorized/
├── components/
│   └── providers.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── auth.ts
│   └── api.ts
└── types/
    └── next-auth.d.ts
```

## Development Notes

- The application uses NextAuth.js for session management
- JWT tokens are automatically handled by NextAuth
- Route protection is implemented through middleware
- All API calls include proper error handling
- TypeScript provides type safety throughout the application

## Backend Requirements

Make sure the Django backend is running on `http://127.0.0.1:8000` with the following endpoints available:

- Authentication endpoints (`/api/login/`, `/api/logout/`, `/api/register/`)
- User profile endpoint (`/api/profile/`)
- All CRUD endpoints for colleges, batches, students, faculty, subjects, and questions

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check that the backend is running and the API URL is correct
2. **Session not persisting**: Verify NEXTAUTH_SECRET is set
3. **Route protection issues**: Check middleware configuration and user roles
4. **API calls failing**: Verify CORS settings in Django backend

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.