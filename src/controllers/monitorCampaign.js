const MonitorCampaign = require('../models/monitorCampaign');

const createMonitorCampaign = async (req, res) => {
  const {
    attachParams,
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
    attachParams,
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
    .populate('attachParams')
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
    attachParams,
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

  const monitorCampaign = await MonitorCampaign.findByIdAndUpdate(
    _id,
    {
      attachParams,
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

  // Cap nhat trang thai cua drone la khong co san

  // Cap nhat trang thai cua mien giam sat

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
};
