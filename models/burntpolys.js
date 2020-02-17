const mongoose = require('mongoose')


const burntpolysSchema = new mongoose.Schema({
  dateGenerated: {
    type: Date,
    default: Date.now
  },
  valid: {
    type: Boolean,
    required: true
  },
  MEL: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  SYD: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  PER: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  ADL: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  HBA: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  CAN: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  BNE: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
  DRW: {
    vic: { type: mongoose.Schema.Types.Mixed, default: {} },
    nsw: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregate: { type: mongoose.Schema.Types.Mixed, default: {} },
    valid: {
      type: Boolean,
      required: true
    },
  },
}, { minimize: false })


module.exports = mongoose.model('BURNTPOLYS', burntpolysSchema)
