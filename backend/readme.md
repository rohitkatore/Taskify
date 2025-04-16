# Project and Task Management API

This is the backend API for the Project and Task Management application. It provides endpoints for user authentication and admin operations.

## Table of Contents

- [Setup](#setup)
- [Authentication API](#authentication-api)
  - [Register](#register)
  - [Login](#login)
  - [Get Current User](#get-current-user)
- [Project API](#project-api)
  - [Create Project](#create-project)
  - [Get Projects](#get-projects)
  - [Get Project Tasks](#get-project-tasks)
- [Task API](#task-api)
  - [Create Task](#create-task)
  - [Update Task](#update-task)
  - [Comment on Task](#comment-on-task)
  - [Get Task Comments](#get-task-comments)

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file with the following variables:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   ```

3. Start the server:
   ```
   npm start
   ```

## Authentication API

Base URL: `/api/auth`

### Register

Register a new user.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body:**

```json
{
  "fullname": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "user" // Optional, defaults to "user"
}
```

**Response:**

- Success (201 Created):

  ```json
  {
    "message": "user register successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Login

Login with existing credentials.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

- Success (201 Created):

  ```json
  {
    "message": "user login successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Get Current User

Get information about the currently authenticated user.

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Authentication**: Required

**Response:**

- Success (200 OK):

  ```json
  {
    "_id": "user_id",
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
  ```

## Project API

Base URL: `/api/projects`

### Create Project

Create a new project. Requires admin privileges.

- **URL**: `/api/projects`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Content-Type**: `application/json`

**Request Body:**

```json
{
  "title": "Project Title",
  "description": "Detailed project description"
}
```

**Response:**

- Success (201 Created):

  ```json
  {
    "message": "Project created successfully.",
    "project": {
      "_id": "project_id",
      "title": "Project Title",
      "description": "Detailed project description",
      "createdBy": "user_id",
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  }
  ```

- Error (400 Bad Request):

  ```json
  {
    "errors": [
      {
        "param": "title",
        "msg": "Title must be present."
      }
    ]
  }
  ```

### Get Projects

Get a list of all projects.

- **URL**: `/api/projects`
- **Method**: `GET`
- **Authentication**: Required

**Response:**

- Success (200 OK):

  ```json
  [
    {
      "_id": "project_id",
      "title": "Project Title",
      "description": "Detailed project description",
      "createdBy": "user_id",
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  ]
  ```

- Error (404 Not Found):

  ```json
  {
    "error": "No projects found."
  }
  ```

### Get Project Tasks

Get all tasks associated with a specific project, with optional filtering.

- **URL**: `/api/projects/:projectId`
- **Method**: `GET`
- **Authentication**: Required
- **URL Parameters**: `projectId` - ID of the project

**Query Parameters:**

- `assignedTo` - When set to `true`, only returns tasks assigned to the current user
- `priority` - Filter tasks by priority
- `status` - Filter tasks by status

**Response:**

- Success (200 OK):

  ```json
  [
    {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task Description",
      "projectId": "project_id",
      "assignedTo": "user_id",
      "status": "pending",
      "priority": "high",
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  ]
  ```

- Error (404 Not Found):

  ```json
  {
    "error": "Project not found"
  }
  ```

## Task API

Base URL: `/api/task`

### Create Task

Create a new task. Requires admin privileges.

- **URL**: `/api/task`
- **Method**: `POST`
- **Authentication**: Required (Admin only)
- **Content-Type**: `application/json`

**Request Body:**

```json
{
  "title": "Task Title",
  "description": "Task Description",
  "assignedTo": "user_id",
  "projectId": "project_id",
  "priority": "High" // Optional, defaults to "Medium"
}
```

**Response:**

- Success (201 Created):

  ```json
  {
    "message": "Task created successfully.",
    "task": {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task Description",
      "assignedTo": "user_id",
      "projectId": "project_id",
      "status": "Pending",
      "priority": "High",
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  }
  ```

- Error (400 Bad Request):

  ```json
  {
    "errors": [
      {
        "param": "title",
        "msg": "Title is required"
      }
    ]
  }
  ```

### Update Task

Update an existing task. Admin users can update all fields, regular users can only update the status.

- **URL**: `/api/task/:taskId`
- **Method**: `PATCH`
- **Authentication**: Required
- **URL Parameters**: `taskId` - ID of the task to update
- **Content-Type**: `application/json`

**Request Body:**

For admin users:

```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "assignedTo": "user_id",
  "priority": "Low",
  "status": "In Progress"
}
```

For regular users:

```json
{
  "status": "In Progress"
}
```

**Response:**

- Success (200 OK):

  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "_id": "task_id",
      "title": "Updated Task Title",
      "description": "Updated Task Description",
      "assignedTo": "user_id",
      "projectId": "project_id",
      "status": "In Progress",
      "priority": "Low",
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  }
  ```

- Error (404 Not Found):

  ```json
  {
    "message": "Task not found."
  }
  ```

### Comment on Task

Add a comment to a task.

- **URL**: `/api/task/:taskId/comment`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**: `taskId` - ID of the task to comment on
- **Content-Type**: `application/json`

**Request Body:**

```json
{
  "comment": "This is a comment on the task."
}
```

**Response:**

- Success (201 Created):

  ```json
  {
    "message": "Comment added successfully.",
    "comment": {
      "_id": "comment_id",
      "comment": "This is a comment on the task.",
      "commentedBy": "user_id",
      "taskId": "task_id",
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  }
  ```

- Error (400 Bad Request):

  ```json
  {
    "errors": [
      {
        "param": "comment",
        "msg": "comment is required"
      }
    ]
  }
  ```

### Get Task Comments

Get all comments for a specific task.

- **URL**: `/api/task/:taskId/comments`
- **Method**: `GET`
- **Authentication**: Required
- **URL Parameters**: `taskId` - ID of the task to get comments for

**Response:**

- Success (200 OK):

  ```json
  {
    "comments": [
      {
        "_id": "comment_id",
        "comment": "This is a comment on the task.",
        "commentedBy": "user_id",
        "taskId": "task_id",
        "createdAt": "2023-06-15T10:30:00.000Z"
      },
      {
        "_id": "comment_id2",
        "comment": "Another comment on the task.",
        "commentedBy": "user_id2",
        "taskId": "task_id",
        "createdAt": "2023-06-15T11:30:00.000Z"
      }
    ]
  }
  ```

- Error (400 Bad Request):

  ```json
  {
    "message": "taskID not found."
  }
  ```

- Error (500 Internal Server Error):

  ```json
  {
    "message": "Error message details"
  }
  ```

## Authentication

All authenticated routes require a JWT token sent in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

The API returns appropriate HTTP status codes along with error messages in JSON format.
