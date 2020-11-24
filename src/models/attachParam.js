const mongoose = require('mongoose');

const attachParamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    property: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const attachParamModel = mongoose.model('AttachParam', attachParamSchema);

module.exports = attachParamModel;
