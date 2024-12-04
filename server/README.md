# TaskMaster - Backend

TaskMaster is a task management web application designed to help users manage their tasks. This repository contains the backend codebase, which provides the RESTful API for managing tasks and user authentication.

---

## Features

- **User Authentication**:
  - User login with JWT-based authentication.
  - Token validation for protected routes.

- **Task Management**:
  - Create, retrieve, update, and delete tasks.
  - Each task includes:
    - Title
    - Notes/Description
    - Priority Level
    - Due Date

- **API Endpoints**:
  - Fully documented RESTful API for easy integration with the frontend.

- **Error Handling**:
  - Structured and consistent error responses for debugging.

---

## Tech Stack

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user and task data.
- **Mongoose**: ODM library for MongoDB.
- **JWT**: Secure token-based authentication.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### API Endpoints

Authentication
Method             Endpoint           Description
POST               /auth/login        Authenticate a user.

Tasks
Method             Endpoint           Description
GET                /user/tasks        Get all tasks for a user.
POST               /user/task         Create a new task.
PUT                /user/task/:taskId Update an existing task.
DELETE             /user/task/:taskId Delete a task.

### Folder Structure

src/
├── controllers/       # Logic for handling requests
├── models/            # Mongoose schemas for users and tasks
├── routes/            # API routes
├── middlewares/       # Middleware for authentication and validation
├── utils/             # Utility functions
├── app.js             # Express app setup
└── index.js          # Server entry point
