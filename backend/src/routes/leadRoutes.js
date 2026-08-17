const express = require("express");

const {
  createLead,
  getLeads,
} = require("../controllers/leadController");

const {
  protect,
  ownerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public homeowner submission
router.post("/", createLead);

// Protected owner lead list
router.get(
  "/admin",
  protect,
  ownerOnly,
  getLeads
);

module.exports = router;