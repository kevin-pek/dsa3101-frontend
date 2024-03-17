# Frontend

## Getting Started

To install the dependencies for the app, run the command:

```sh
npm install
```

To start the frontend app, run the command:

```sh
npm run dev
```

## Project Structure

```plaintext
src
│
├── assets
│ └── (Contains all static files like images and icons used in the app)
│
├── components
│ ├── Navbar.jsx (A component for navigation)
│ └── RequireAuth.jsx (A component to protect routes for authorized users only)
│
├── hooks
│ └── auth.tsx (Custom React hooks for authentication logic)
│
└── pages
  ├── Bookings.jsx (Page for handling bookings)
  ├── Dashboard.jsx (Main overview page of the app)
  ├── Employees.jsx (Page for managing employees)
  ├── Login.jsx (Page for user login)
  └── Planner.jsx (Page for planning and scheduling)
```
