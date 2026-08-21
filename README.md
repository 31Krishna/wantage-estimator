# 🏠 Wantage Roofing Estimator

A full-stack roofing cost estimation application built with the **MERN stack**.

The application allows customers to submit their roofing requirements and receive an estimated roofing cost range. It also provides a secure admin dashboard where authorized owners can view and manage customer leads.

---

## 🚀 Live Application

### Backend API

https://wantage-estimator-api.onrender.com

### Frontend

https://wantage-estimator-api1.onrender.com

---

## ✨ Features

### 👤 Customer Roofing Estimator

- Customer name, email and phone collection
- Roof area input
- Roofing material selection
- Roof pitch selection
- Existing roofing layer selection
- Number of house stories
- Automatic roofing cost calculation
- Minimum and maximum estimate
- Configuration version tracking
- Customer lead storage in MongoDB

### 🔐 Admin Dashboard

- Owner login
- JWT authentication
- Protected admin routes
- Owner-only authorization
- Total leads overview
- Average estimate calculation
- Latest configuration version
- Customer leads table
- Search by name, email or phone
- Filter by roofing material
- Filter by configuration version
- Sort leads by date
- Customer details modal
- Roofing requirements details
- Estimate details
- Configuration information
- Refresh dashboard data
- Responsive dark-themed UI

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB Atlas

### Deployment

- Render

---

## 📂 Project Structure

```text
wantage-estimator/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
