# Role-Based Access Control System (RBAC)

This project implements a **Role-Based Access Control (RBAC)** system to manage user roles, permissions, and secure access within an application. It is designed to provide a scalable and secure solution for managing multiple user types: **Super Admin**, **Admin**, and **User**.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Logs Feature](#logs-feature)
- [Future Enhancements](#future-enhancements)

---

## Features

### Super Admin Capabilities:

- **Assign Roles**: Grant roles to users and promote them as required.
- **Permission Management**:
  - **View**: Enable/disable view access for admins.
  - **Delete**: Grant/remove delete permissions for admins.
  - **Modify**: Allow/restrict the ability to update user data.
- **Block Users**: Restrict login access for users violating policies.

### Admin Capabilities:

- **View Users**: View users if the Super Admin grants permission.
- **Delete Users**: Remove users from the database if the Delete permission is assigned.
- **Modify User Information**: Edit user details if Modify permission is granted.

### User Capabilities:

- **Registration and Login**: Users can sign up and log in.
- **Restricted Access**: Blocked users cannot log in to the system.

### Logs Feature:

- Track all administrative actions, such as assigning roles, blocking users, granting permissions, and deleting accounts.
- Logs are visible to super Admin for transparency.

---

## Technologies Used

### Frontend:

- **React** with the following packages:
  - Material UI: `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`
  - Styling: `@emotion/react`, `@emotion/styled`
  - State Management: `axios`, `js-cookie`
  - Routing: `react-router-dom`
  - Additional Development Tools: Tailwind CSS, PostCSS, Autoprefixer

### Backend:

- **Node.js** with the following packages:
  - Express.js for server setup
  - Mongoose for MongoDB integration
  - Authentication: `jsonwebtoken`, `bcrypt`
  - Security: `cors`, `cookie-parser`, `crypto-js`
  - Configuration Management: `dotenv`
  - Development Utility: `nodemon`

---

## Setup Instructions

### Prerequisites:

- Node.js installed
- MongoDB running locally or remotely

### Steps:

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/litikesh/RBAC.git
    cd RBAC
    ```

2.  **Frontend Setup**:

    ```bash
    cd frontend
    npm install
    npm start
    ```

3.  **Backend Setup**:

    ```bash
    cd server
    npm install
    npm run dev
    ```

4.  **Environment Variables**:

    - Create a `.env` file in the `server` directory and add the following:
      ```env
      PORT=5000
      JWT_SECRET=<your_jwt_secret_key>
      JWT_EXPIRATION=<jwt_token_expiration_time> # e.g., 1h, 7d
      CONNECTION_STRING=<your_mongodb_connection_string>
      ```

---

## Usage

1. Start the frontend and backend servers.
2. Access the application at `http://localhost:3000`.
3. Log in with the appropriate role:
   - Super Admin: Full control over users and permissions.
   - Admin: Limited control based on granted permissions.
   - User: Can only log in and use general application features.

---

## Logs Feature

Admins can view all actions performed on user accounts:

- Assigning roles
- Granting or revoking permissions
- Blocking or unblocking users
- Deleting users

Logs ensure transparency and traceability of all administrative actions.

---

## Future Enhancements

- Add multi-factor authentication for improved security.
- Implement more granular permissions for Admins.
- Provide a dashboard for analytics on user activities.
- Enable notifications for critical actions (e.g., role changes).

---

Feel free to contribute or raise issues to enhance this project! 🎉
