const mongoose = require('mongoose')

const nswSchema = new mongoose.Schema({
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
      zeroAreaCount: {
        type: Number,
        required: true
      }
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

module.exports = mongoose.model('NSW', nswSchema)
