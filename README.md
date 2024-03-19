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

You should see a link in the terminal showing a localhost url to access the app.

## Project Structure

```plaintext
src
│
├── assets
│ └── (Contains all static files like images and icons used in the app)
│
├── components (Reusable React Components)
│ ├── Navbar.jsx (A component for navigation)
│ └── RequireAuth.jsx (A component to protect routes for authorized users only)
│
├── hooks
│ └── auth.tsx (Custom React hooks for authentication logic)
│
└── pages (Correspond to each page in the app)
  ├── Bookings.jsx (Page for handling events/bookings)
  ├── Dashboard.jsx (Main overview page of the app)
  ├── Employees.jsx (Page for managing employees)
  ├── Login.jsx (Page for user login)
  └── Schedule.jsx (Page for planning/scheduling)
```
