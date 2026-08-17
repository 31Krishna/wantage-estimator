const Configuration = require("../models/Configuration");

const getAdminConfig = async (req, res) => {
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
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch configuration",
    });
  }
};

const updateConfig = async (req, res) => {
  try {
    const currentConfig = await Configuration.findOne()
      .sort({ config_version: -1 });

    if (!currentConfig) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    const nextVersion =
      currentConfig.config_version + 1;

    const newConfig = await Configuration.create({
      config_version: nextVersion,

      business: req.body.business,
      questions: req.body.questions,
      modifiers: req.body.modifiers,
    });

    res.status(201).json({
      message: "Configuration updated successfully",
      config: newConfig,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to update configuration",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminConfig,
  updateConfig,
};