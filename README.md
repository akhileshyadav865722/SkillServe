# 🛠️ SkillServe — Service Hiring Marketplace

[![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)

---

## 📌 Project Overview

**SkillServe** is a full-stack service-hiring marketplace web application designed to connect clients seeking local or remote services with skilled professionals and service providers. 

The platform streamlines the end-to-end service lifecycle: from discovering available services, placing requests, and submitting quotes/offers, to managing order workflows and communicating in real-time.

---

## 🖼️ Project Preview

> 📸 *Screenshots of the UI (Dashboard, Service Listings, and Chat) can be added here.*

---

## ✨ Key Features

- 🔐 **Authentication & Authorization**: Secure user registration and login with password hashing (`bcryptjs`) and JSON Web Tokens (`JWT`).
- 👥 **Role-Based Workflows**: Separate profiles and dashboards for **Clients** (service seekers) and **Providers** (skilled workers).
- 📋 **Service Catalog & Discovery**: Browse, filter, and search services across various categories with rich descriptions and pricing.
- 📬 **Service Requests & Offers**: Clients can post custom tasks/service requests; providers can review requirements and submit competitive offers.
- ⚡ **Real-Time Updates**: Integrated with **Socket.IO** for live notifications, status updates, and interactive communication.
- 🗂️ **Media & File Handling**: Integrated **Multer** for profile avatars and project attachments.
- 🎨 **Responsive UI/UX**: Built with **React 19**, **Tailwind CSS v4**, and **Lucide React** icons for a clean, mobile-first experience.
- 🔄 **Centralized State Management**: Powered by **Redux Toolkit** and **React Router v7** for smooth client-side navigation.

---

## 🛠️ Technologies Used

### Frontend
- **Framework**: React 19
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@tailwindcss/postcss`, `autoprefixer`)
- **Icons & UI**: Lucide React (`lucide-react`)
- **HTTP Client**: Axios
- **Real-Time Client**: Socket.io-client
- **Build Tool**: Vite

### Backend
- **Runtime Environment**: Node.js
- **Server Framework**: Express.js
- **Database & ODM**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcryptjs`)
- **Real-Time Engine**: Socket.IO
- **File Uploads**: Multer
- **Async Handling**: `express-async-errors`
- **Environment Config**: Dotenv & CORS

### Development Tools
- **Version Control**: Git & GitHub
- **API Testing**: Postman
- **Dev Runner**: Nodemon & Concurrently

---

## 📂 Project Structure

```text
SkillServe/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Modals, Cards)
│   │   ├── pages/               # Route views (Home, Services, Dashboard, Auth)
│   │   ├── store/               # Redux slices and store configuration
│   │   ├── services/            # Axios API instances & Socket client
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Application (Node.js + Express)
│   ├── config/                  # Database connection (MongoDB)
│   ├── controllers/             # Business logic (Auth, Services, Orders)
│   ├── middleware/              # JWT auth verification & error handler
│   ├── models/                  # Mongoose data schemas (User, Service, Request)
│   ├── routes/                  # Express API route endpoints
│   ├── server.js                # Express & Socket.IO server initialization
│   └── package.json
│
├── package.json                 # Root script runner (Concurrently)
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/akhileshyadav865722/SkillServe.git
cd SkillServe
```

### 2. Install Root, Server, and Client Dependencies
```bash
# Install root orchestrator dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

### 4. Run Locally
From the root directory, start both the backend server and frontend client concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🌐 Live Demo

- **Live Demo**: *Coming soon*
- **Source Code**: [https://github.com/akhileshyadav865722/SkillServe](https://github.com/akhileshyadav865722/SkillServe)

---

## 🤝 Future Enhancements

- 💳 Integration of secure payment gateways (Stripe / Razorpay).
- ⭐ Review and rating system for completed service requests.
- 📍 Geo-location based provider filtering.
- 📱 Progressive Web App (PWA) support.

---

## 👨‍💻 Author

**Akhilesh Yadav (Akhil)**
- **GitHub**: [@akhileshyadav865722](https://github.com/akhileshyadav865722)
- **LinkedIn**: [Akhilesh Yadav](https://www.linkedin.com/in/akhilesh-yadav-2746582bb/)
- **Email**: [akhileshyadav932163@gmail.com](mailto:akhileshyadav932163@gmail.com)
- **Portfolio**: [akhileshyadav865722.github.io](https://akhileshyadav865722.github.io)

