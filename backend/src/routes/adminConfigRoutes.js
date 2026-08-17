const express = require("express");

const {
  getAdminConfig,
  updateConfig,
} = require("../controllers/adminConfigController");

const {
  protect,
  ownerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  ownerOnly,
  getAdminConfig
);

router.put(
  "/",
  protect,
  ownerOnly,
  updateConfig
);

module.exports = router;