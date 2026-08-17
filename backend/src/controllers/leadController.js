const Lead = require("../models/Lead");
const Configuration = require("../models/Configuration");

const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      answers,
      estimate,
      config_version,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !answers ||
      !estimate ||
      config_version === undefined
    ) {
      return res.status(400).json({
        message: "All lead fields are required",
      });
    }

    // Make sure the configuration used by the estimator exists
    const config = await Configuration.findOne({
      config_version,
    });

    if (!config) {
      return res.status(400).json({
        message: "Invalid configuration version",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      address,
      answers,
      estimate,
      config_version,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
};
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
};

module.exports = {
  createLead,
  getLeads
};