const mongoose = require('mongoose')


const adlSchema = new mongoose.Schema({
  vic: { type: mongoose.Schema.Types.Mixed, default: {} },
  nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
  aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
  dateGenerated: {
    type: Date,
    default: Date.now
  },
  valid: {
    type: Boolean,
    required: true
  },
}, { minimize: false })


module.exports = mongoose.model('ADL', adlSchema)
