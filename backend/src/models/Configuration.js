const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    rate_per_sqft: {
      type: Number,
      required: false,
    },

    multiplier: {
      type: Number,
      required: false,
    },

    tear_off_per_sqft: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["number", "select"],
      required: true,
    },

    unit: {
      type: String,
    },

    required: {
      type: Boolean,
      default: false,
    },

    min: {
      type: Number,
    },

    max: {
      type: Number,
    },

    active: {
      type: Boolean,
      default: true,
    },

    options: {
      type: [optionSchema],
      default: [],
    },
  },
  { _id: false }
);

const configurationSchema = new mongoose.Schema(
  {
    config_version: {
      type: Number,
      required: true,
      unique: true,
    },

    business: {
      name: {
        type: String,
        required: true,
      },

      region: {
        type: String,
        required: true,
      },

      currency: {
        type: String,
        required: true,
      },
    },

    questions: {
      type: [questionSchema],
      required: true,
    },

    modifiers: {
      waste_factor: {
        type: Number,
        required: true,
      },

      permit_flat_fee: {
        type: Number,
        required: true,
      },

      range_spread_pct: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Configuration",
  configurationSchema
);