const express = require("express");
const {
  getCurrentConfig,
} = require("../controllers/configController");

const router = express.Router();

router.get("/", getCurrentConfig);

module.exports = router;