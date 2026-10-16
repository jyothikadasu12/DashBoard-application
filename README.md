
# DashFlow — React Admin Dashboard

A modern, responsive admin dashboard built with React and Vite. DashFlow provides a clean workspace interface for viewing team members, managing workspace settings, customizing appearance, and handling profile preferences.

## Features

### Dashboard
- Clean and responsive dashboard interface.
- Workspace overview and welcome section.
- Dynamic team member count.
- Administrator and editor counts based on actual team data.
- Team members table displaying names, email addresses, and roles.
- Quick navigation to Users and Settings pages.

### Team Management
- View workspace team members.
- Add new members with a name, email, and role.
- Remove team members.
- Share team member data between pages using React Context API.
- Persist team member data in browser local storage.

### Settings
- Edit profile information.
- Upload and preview a profile photo.
- Change the dashboard theme and accent color.
- Configure notification preferences.
- Validate the security form.
- Update workspace details.
- Manage team members.

### Authentication and Navigation
- Demo login and logout functionality.
- Protected routes for authenticated users.
- React Router navigation.
- Shared authentication and profile state through Context API.

### Responsive Design
- Desktop, tablet, and mobile layouts.
- Responsive dashboard cards and team table.
- Consistent spacing, typography, and styling.

## Technologies Used

- React
- JavaScript (ES6+)
- Vite
- React Router DOM
- React Context API
- React Hooks
  - `useState`
  - `useEffect`
  - `useContext`
  - `useNavigate`
- HTML5
- CSS3
- Browser Local Storage

## Project Structure

```text
dashboard-application/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx
│   │   ├── Sidebar.css
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Users.jsx
│   │   ├── Users.css
│   │   ├── Settings.jsx
│   │   ├── Settings.css
│   │   ├── Login.jsx
│   │   └── Login.css
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

*Note: The structure above represents the main project files. Keep any additional files already present in your project.*

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Visual Studio Code

Check your installation:

```bash
node -v
npm -v
```

### 1. Clone the repository

If the project is hosted on GitHub:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace the placeholder with your repository URL.

### 2. Open the project

```bash
cd dashboard-application
```

Open the folder in Visual Studio Code.

### 3. Install dependencies

```bash
npm install
```

If React Router DOM is not already installed:

```bash
npm install react-router-dom
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

### 5. Create a production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Demo Login

Use these demo credentials if they match the login logic in `AuthContext.jsx`.

| Field | Value |
|---|---|
| Email | admin@example.com |
| Password | admin123 |

**Security note:** These are demonstration credentials, not production authentication. A real application should authenticate users through a secure backend.

## Application Routes

| Route | Purpose |
|---|---|
| `/login` | User login |
| `/` | Dashboard overview |
| `/users` | Team member management |
| `/settings` | Profile, preferences, security, and workspace settings |

Protected routes require a logged-in user, according to the application's authentication context and route configuration.

## How the Application Works

### 1. Authentication Context

`AuthContext.jsx` provides shared state and functions for authentication, profile information, workspace preferences, workspace details, and team members.

Components access this shared state using the custom `useAuth()` hook.

### 2. Dashboard Data

`Dashboard.jsx` reads `teamMembers`, `workspace`, and `profile` from the Context API.

The member count and role counts are calculated from the current team data rather than hard-coded dashboard statistics.

### 3. Team Management

The Users and Settings pages use shared team state. When a member is added or removed, the updated list can be displayed on the dashboard and Users page.

### 4. Local Storage

The application uses browser local storage to retain selected application data across page refreshes.

This is suitable for learning and demonstrations. Local storage is not a secure database or a replacement for server-side persistence.

### 5. Routing

React Router handles navigation between the login, dashboard, Users, and Settings pages without requiring a full page reload.

## Learning Outcomes

By developing this project, you can practice:

- Building reusable React components.
- Managing local component state with `useState`.
- Sharing global state using Context API.
- Synchronizing and persisting data with `useEffect`.
- Creating protected routes with React Router.
- Handling forms and input validation.
- Rendering dynamic lists with `map()`.
- Filtering and calculating values from arrays.
- Building responsive layouts with CSS.
- Organizing a React project into components, context, pages, and styles.

## Future Improvements

- Connect a backend API and database.
- Implement secure authentication and role-based authorization.
- Add real-time team updates.
- Add automated tests.
- Add meaningful analytics backed by actual data.
- Deploy the application to a hosting platform.

## Author

Developed as a React learning project to practice modern frontend development, routing, global state management, component architecture, and responsive UI design.
