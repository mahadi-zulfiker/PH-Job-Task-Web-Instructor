Eventify: Your Ultimate Event Management Platform
=================================================

Overview
--------

Eventify is a modern, full-stack event management application built with the MERN stack (MongoDB, Express.js - via Next.js API Routes, React, Node.js) and Next.js 14+ App Router. It allows users to discover, create, and manage events seamlessly. With a focus on a clean user interface and robust functionality, Eventify aims to be your go-to platform for all event-related needs.

Features
--------

*   User Authentication: Secure registration and login powered by JWT (JSON Web Tokens).
*   Event Creation: Authenticated users can easily create new events with details like title, date, time, location, and description.
*   Event Browse: Explore a list of all available events.
*   Event Filtering & Search: Filter events by date, date range, and search by title for quick discovery.
*   Event Management: Users can view, update, and delete events they have posted.
*   Event Joining/Unjoining: Users can join events to track attendance and unjoin if plans change.
*   Responsive Design: Optimized for a seamless experience across various devices (desktops, tablets, and mobile phones).
*   Modern UI: Built with Tailwind CSS and Shadcn UI components for a beautiful and consistent look and feel.
*   Subtle Animations: Enhancements for a more engaging user experience.

Tech Stack
----------

### Frontend:

*   Next.js 14+: React framework for hybrid rendering (SSR, SSG, ISR, CSR).
*   React.js: Frontend library for building user interfaces.
*   TypeScript: Type-safe JavaScript for robust development.
*   Tailwind CSS: A utility-first CSS framework for rapid UI development.
*   Shadcn UI: Reusable components built with Radix UI and Tailwind CSS.
*   Lucide React: Beautiful, open-source icons.
*   date-fns: Modern JavaScript date utility library.
*   sonner: A delightful toast component for notifications.
*   axios: Promise-based HTTP client for API requests.

### Backend (Next.js API Routes):

*   Node.js: JavaScript runtime environment.
*   Express.js (Implicitly via Next.js API Routes): For handling API requests.
*   Mongoose: MongoDB object data modeling (ODM) for Node.js.
*   bcryptjs: For hashing and comparing passwords securely.
*   jsonwebtoken: For generating and verifying JWTs for authentication.

### Database:

*   MongoDB: NoSQL document database.
*   MongoDB Atlas: Cloud-hosted MongoDB service for scalable and reliable database management.

Getting Started
---------------

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v18.x or higher recommended)
*   npm or Yarn
*   Git

### Installation

1.  Clone the repository:  
    
        git clone https://github.com/your-username/eventify.git
        cd eventify
    
2.  Install dependencies:
    
        npm install
        # OR
        yarn install
    
3.  Set up Environment Variables:  
    Create a `.env.local` file in the root of your project and add the following:
    
        # MongoDB Connection URI (from MongoDB Atlas)
        MONGODB_URI="mongodb+srv://<your_atlas_user>:<your_atlas_password>@<your_cluster_name>.mongodb.net/<your_database_name>?retryWrites=true&w=majority&appName=Cluster0"
        
        # Secret key for JWT token generation
        # Generate a strong, random string (e.g., using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
        JWT_SECRET="your_very_strong_and_long_jwt_secret_key"
    
    *   MongoDB Atlas Setup:
        *   Create a free-tier cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
        *   Create a Database User with "Read and write to any database" access.
        *   Configure Network Access to allow connections from your current IP address (or 0.0.0.0/0 for development, but restrict for production).
        *   Copy the connection string and replace the placeholders (<username>, <password>, <cluster-name>, <database-name>) in MONGODB\_URI.

Running the Application
-----------------------

To run the development server:

    npm run dev

OR

    yarn dev

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

Authentication Flow
-------------------

1.  Registration:
    *   User provides name, email, and password.
    *   Frontend sends data to /api/auth/register.
    *   Backend hashes the password using bcryptjs.
    *   A new User document is created in MongoDB.
    *   A JWT is generated using jsonwebtoken and returned to the client.
    *   The JWT and user data are stored in localStorage via AuthContext.
2.  Login:
    *   User provides email and password.
    *   Frontend sends data to /api/auth/login.
    *   Backend finds the user by email and compares the provided password with the hashed password using bcryptjs.
    *   If credentials match, a new JWT is generated and returned.
    *   JWT and user data are stored in localStorage.
3.  Protected Routes:
    *   Routes like /add-event, /my-events, and certain API endpoints are protected.
    *   The AuthContext ensures users are redirected to login if not authenticated.
    *   API routes use a custom protect middleware to verify the JWT token sent in the Authorization header.

Contributing
------------

Contributions are welcome! If you find a bug or have an idea for an enhancement, please open an issue or submit a pull request.

License
-------

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.