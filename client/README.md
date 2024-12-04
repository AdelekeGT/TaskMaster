# TaskMaster - Frontend

TaskMaster is a task management web application designed to help users create, manage, and track their tasks efficiently. This repository contains the frontend codebase, built with React and styled with Tailwind CSS, to provide an intuitive and responsive user interface.

---

## Features

- **User Authentication**:
  - Secure login and logout functionality.
  - Persistent authentication using JWT stored in localStorage.

- **Dashboard**:
  - View all user-created tasks.
  - Search for tasks by title.
  - Add, update, or delete tasks seamlessly.

- **Add Task**:
  - Create new tasks with the following details:
    - Title
    - Notes/Description
    - Priority Level (e.g., High, Medium, Low)
    - Due date

- **Update Task**:
  - Edit existing tasks to update details like title, notes, or priority level.

- **Protected Routes**:
  - Ensure that only authenticated users can access the dashboard, task creation, and update pages.

- **Responsive Design**:
  - Mobile-first and fully responsive layout using Tailwind CSS.

---

## Tech Stack

- **React.js**: For building the user interface.
- **React Router**: For navigation and route protection.
- **Axios**: For HTTP requests to the backend.
- **Tailwind CSS**: For modern and responsive styling.

---

## Folder Structure

src/
├── components/        # Reusable UI components
├── context/           # Context API for global state management
├── pages/             # Main application pages (Dashboard, AddTask, UpdateTask)
├── utils/             # Utility functions and axios instance
├── App.js            # Main app component
├── main.js           # Entry point
└── index.css          # Tailwind CSS configuration

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AdelekeGT/taskmaster-frontend.git
   cd taskmaster-frontend
   ```
