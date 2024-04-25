# Frontend

This is the frontend repo for DSA3101 Manpower Optimisation for MFLG, built using Vite, React and Mantine UI.

To deploy this application along with the database and backend, see our [deployment repo](https://github.com/kevin-pek/dsa3101-deployment).

For a guide on how our frontend application works, please check out our [user guide](https://docs.google.com/document/d/1UIK-Pzp5kED8erwhT2WhK-t0zv-lOWuc3SqK3n4nTaQ/edit?usp=sharing)!

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

To login to the application, enter the login details `manager` and `pword123`.

## Project Structure

Here's a list of the important files in this project directory.

```plaintext
├── public                    # folder for accessible media files
├── server                    # express server used for serving static files during deployment
│   ├── index.js              # entrypoint for express server
│   ├── package.json          # package.json for running express server. should only contain server dependencies
│   └── package-lock.json
├── src
│   ├── api
│   │   └── index.ts          # axios client, api error handler and generic fetcher functions
│   ├── assets                # contains all static files like images and icons used in the app
│   ├── components
│   │   ├── schedule          # folder for components used for displaying schedules
│   │   ├── Navbar.jsx        # navigation sidebar with responsive design
│   │   ├── RequireAuth.jsx   # component to protect routes for authorized users only
│   │   └── ...
│   ├── hooks
│   │   ├── use-schedules.ts  # hooks for schedule related operations with backend
│   │   ├── use-employees.ts  # hooks for employee related operations with backend
│   │   ├── use-events.ts     # hooks for events related operations with backend
│   │   └── use-auth.tsx      # useAuth hook for authentication logic
│   ├── types                 # Typescript definitions for data passed between frontend/backend
│   │   ├── booking.ts
│   │   ├── employee.ts
│   │   ├── schedule.ts
│   │   └── constants.ts      # Constants used in the project, days of week and working hours
│   ├── pages                 # Components that correspond to a single page in the app
│   │   ├── Dashboard.jsx     # Dashboard for displaying employee statistics and demand forecasts
│   │   ├── Events.jsx        # Page for handling upcoming events
│   │   ├── Employees.jsx     # Page for managing employee information and availability
│   │   ├── Planner.jsx       # Page for shift planning
│   │   └── Login.jsx         # Page for user login
│   └── main.jsx              # entrypoint for React application
├── index.html                # React app is rendered to this HTML document
├── package.json              # dependencies for React application
├── Dockerfile                # Dockerfile for building and shipping this app
├── README.md                 # YOU ARE HERE
└── ...
```
