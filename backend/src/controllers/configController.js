const Configuration = require("../models/Configuration");

const getCurrentConfig = async (req, res) => {
  try {
    const config = await Configuration.findOne()
      .sort({ config_version: -1 })
      .lean();

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch configuration",
    });
  }
};

module.exports = {
  getCurrentConfig,
};