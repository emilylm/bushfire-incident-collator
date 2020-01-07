const mongoose = require('mongoose')

const vicSchema = new mongoose.Schema({
  count: {
    wildfire: {
      type: Number,
      required: true
    },
    nonWildfire: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
  },
  area: {
    total: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    unquantifiedFires: {
      smallAreaCount: {
        type: Number,
        required: true
      },
      mediumAreaCount: {
        type: Number,
        required: true
      },
      largeAreaCount: {
        type: Number,
        required: true
      },
      spotAreaCount: {
        type: Number,
        required: true
      },
      unknownAreaCount: {
        type: Number,
        required: true
      },
    }
  },
  dateGenerated: {
    type: Date,
    default: Date.now
  },
  valid: {
    type: Boolean,
    required: true
  },
})

module.exports = mongoose.model('VIC', vicSchema)
