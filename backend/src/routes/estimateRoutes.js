const express = require("express");

const {
  createEstimate,
} = require("../controllers/estimateController");

const router = express.Router();

router.post("/", createEstimate);

module.exports = router;