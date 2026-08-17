require("dotenv").config();
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const configRoutes = require("./routes/configRoutes");
const estimateRoutes = require("./routes/estimateRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const adminConfigRoutes = require("./routes/adminConfigRoutes");
const leadRoutes = require("./routes/leadRoutes");


connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Wantace API is running",
  });
});

app.use("/api/config", configRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/admin/config",
  adminConfigRoutes
);
app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});