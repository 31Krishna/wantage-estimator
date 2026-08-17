const Configuration = require("../models/Configuration");
const calculateEstimate = require("../services/calculator");

const createEstimate = async (req, res) => {
  try {
    const {
      answers,
      config_version,
    } = req.body;

    // Validate estimator answers
    if (!answers || config_version === undefined) {
      return res.status(400).json({
        message: "Answers and config_version are required",
      });
    }

    // Get the exact configuration used by the frontend
    const config = await Configuration.findOne({
      config_version,
    });

    if (!config) {
      return res.status(400).json({
        message: "Configuration version not found",
      });
    }

    // Calculate estimate using server-side logic
    const result = calculateEstimate(
      config,
      answers
    );

    res.status(200).json({
      message: "Estimate generated successfully",
      estimate_low: result.estimate_low,
      estimate_high: result.estimate_high,
      config_version,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message || "Failed to generate estimate",
    });
  }
};

module.exports = {
  createEstimate,
};