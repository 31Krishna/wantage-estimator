# 🏠 Wantage Roofing Estimator

A full-stack roofing cost estimation application built with the **MERN stack**.  
The application allows customers to submit their roofing requirements and receive an estimated cost range. It also includes a secure admin dashboard for managing and reviewing customer leads.

---

## 📌 Features

### Customer Estimator

- Enter customer information
- Enter roof area
- Select roofing material
- Select roof pitch
- Select number of existing roofing layers
- Select number of house stories
- Generate estimated roofing cost
- Display minimum and maximum estimate
- Store customer lead in MongoDB
- Store configuration version used for the estimate

### Admin Dashboard

- Secure owner login
- JWT-based authentication
- Protected admin routes
- View total customer leads
- View average estimate
- View latest configuration version
- Search leads by:
  - Name
  - Email
  - Phone
- Filter leads by roofing material
- Filter leads by configuration version
- Sort leads by date
- View detailed customer information
- View roofing requirements
- View estimate range
- View configuration version
- Refresh dashboard data

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

### Deployment

- Render
- MongoDB Atlas

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
