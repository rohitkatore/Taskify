# Project and Task Management System

A modern, full-stack web application for managing projects and tasks with team collaboration features.

![Project Screenshot](frontend/public/screenshot.png)

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Project Management**: Create, view, and manage projects
- **Task Management**: Create tasks within projects with priority levels and status tracking
- **Comments System**: Add comments on tasks for team communication
- **Dynamic Dashboard**: Visual overview of project and task statistics
- **Task Filtering**: Filter tasks by status, priority, and assignment
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend

- React 19 with Hooks
- React Router v7 for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Axios for API requests
- React Hook Form for form handling
- Context API for state management

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/ProjectAndTaskManagement.git
   cd ProjectAndTaskManagement
   ```

2. Set up the backend

   ```
   cd backend
   npm install
   ```

3. Configure environment variables

   - Create a `.env` file in the backend directory using the provided `.env.example` template
   - Update with your MongoDB connection string and JWT secret

4. Set up the frontend

   ```
   cd ../frontend
   npm install
   ```

5. Start the development servers

   - For backend:
     ```
     cd backend
     npm start
     ```
   - For frontend:
     ```
     cd frontend
     npm run dev
     ```

6. Access the application
   - Frontend: http://localhost:5173
   - Backend API: https://projectandtaskmanagement.onrender.com

## API Documentation

The backend API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user information

### Projects

- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project with tasks

### Tasks

- `POST /api/task` - Create a new task
- `PATCH /api/task/:taskId` - Update a task
- `GET /api/task/:taskId` - Get a specific task
- `DELETE /api/task/:taskId` - Delete a task
- `POST /api/task/:taskId/comment` - Add a comment to a task
- `GET /api/task/:taskId/comments` - Get all comments for a task

For a detailed API documentation, please refer to the [backend/readme.md](backend/readme.md) file.

## User Roles

- **Admin**: Can create and manage projects, create tasks, and assign them to users
- **User**: Can view assigned projects, update task status, and add comments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Framer Motion](https://www.framer.com/motion/)
