const MonitorCampaign = require('../models/monitorCampaign');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const createMonitorCampaign = async (req, res) => {
  const {
    labels,
    description,
    drones,
    endTime,
    mechanism,
    metadataType,
    monitoredObject,
    monitoredZone,
    name,
    resolution,
    startTime,
  } = req.body;

  const monitorCampaign = await MonitorCampaign.create({
    labels,
    description,
    drones,
    endTime,
    mechanism,
    metadataType,
    monitoredObject,
    monitoredZone,
    name,
    resolution,
    startTime,
  });

  // Cap nhat trang thai cua drone la khong co san

  // Cap nhat trang thai cua mien giam sat

  res.send({
    status: 1,
    result: {
      monitorCampaign,
    },
  });
};

const getMonitorCampaigns = async (req, res) => {
  const monitorCampains = await MonitorCampaign.find({})
    .populate('labels')
    .lean();

  const monitorCampainsFullInfo = await Promise.all(
    monitorCampains.map(async (monitorCampain) => {
      const {
        drones: droneIds,
        monitoredObject: monitoredObjectId,
        monitoredZone: monitoredZoneId,
      } = monitorCampain;

      // map droneIds with fully info drones

      // map monitoredObject with fully info monitor object

      // map monitoredZone with fully info monitor zone

      return {
        ...monitorCampain,
        monitoredObject: { _id: monitoredObjectId, name: 'Lửa trại' },
        monitoredZone: { _id: monitoredZoneId, name: 'Tiểu khu A' },
      };
    })
  );

  res.send({
    status: 1,
    result: {
      monitorCampains: monitorCampainsFullInfo,
    },
  });
};

const updateMonitorCampaign = async (req, res) => {
  const {
    _id,
    labels,
    description,
    drones,
    endTime,
    mechanism,
    metadataType,
    monitoredObject,
    monitoredZone,
    name,
    resolution,
    startTime,
  } = req.body;

  if (!_id) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing _id');
  }

  const monitorCampaign = await MonitorCampaign.findByIdAndUpdate(
    _id,
    {
      labels,
      description,
      drones,
      endTime,
      mechanism,
      metadataType,
      monitoredObject,
      monitoredZone,
      name,
      resolution,
      startTime,
    },
    { new: true }
  );

  if (!monitorCampaign) {
    throw new CustomError(codes.NOT_FOUND);
  }

  // Cap nhat trang thai cua drone la khong co san

  // Cap nhat trang thai cua mien giam sat

  res.send({
    status: 1,
    result: {
      monitorCampaign,
    },
  });
};

const removeMonitorCampaign = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing _id');
  }

  const monitorCampaign = await MonitorCampaign.findByIdAndRemove(_id);

  if (!monitorCampaign) {
    throw new CustomError(codes.NOT_FOUND);
  }

  res.send({
    status: 1,
    result: {
      monitorCampaign,
    },
  });
};

const getMonitorCampaignById = async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing _id');
  }

  const monitorCampaign = await MonitorCampaign.findById(_id);

  if (!monitorCampaign) {
    throw new CustomError(codes.NOT_FOUND);
  }

  res.send({
    status: 1,
    result: {
      monitorCampaign,
    },
  });
};

module.exports = {
  createMonitorCampaign,
  getMonitorCampaigns,
  updateMonitorCampaign,
  removeMonitorCampaign,
  getMonitorCampaignById,
};
