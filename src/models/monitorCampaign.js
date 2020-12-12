const mongoose = require('mongoose');

const monitorCampaignSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      enum: ['Cháy rừng', 'Đê điều', 'Điện', 'Cây trồng'],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    drones: [
      {
        _id: false,
        id: {
          type: String,
          required: true,
        },
        payloads: [
          {
            type: String,
            required: true,
          },
        ],
        flightPaths: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
    monitoredObjects: [
      {
        type: String,
        required: true,
      },
    ],
    monitoredZone: {
      type: String,
      required: true,
    },
    mechanism: {
      type: String,
      required: true,
    },
    metadataType: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
      required: true,
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const monitorCampaignModel = mongoose.model(
  'MonitorCampain',
  monitorCampaignSchema
);

module.exports = monitorCampaignModel;
