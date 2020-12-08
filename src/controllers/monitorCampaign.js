const MonitorCampaign = require('../models/monitorCampaign');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const axios = require('axios').default;

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
  let { timeFrom, timeTo } = req.query;
  if (!timeFrom) {
    timeFrom = '2020-1-1';
  }

  if (!timeTo) {
    timeTo = '2025-1-1';
  }

  timeTo = new Date(timeTo);
  timeFrom = new Date(timeFrom);

  console.log({ timeFrom, timeTo });

  const monitorCampains = await MonitorCampaign.find({
    startTime: { $gte: timeFrom },
    endTime: { $lte: timeTo },
  })
    .populate('labels')
    .lean();

  console.log({ monitorCampains });

  const numberOfMonitorCampaigns = monitorCampains.length;

  const monitorCampainsFullInfo = await Promise.all(
    monitorCampains.map(async (monitorCampain) => {
      const {
        drones: droneIds,
        monitoredObject: monitoredObjectId,
        monitoredZone: monitoredZoneId,
      } = monitorCampain;
      let res;

      // map droneIds with fully info drones

      // map monitoredObject with fully info monitor object
      res = await axios.get(
        `https://dsd05-monitored-object.herokuapp.com/monitored-object/detail-monitored-object/${monitoredObjectId}`
      );

      const monitoredObject = res.data.content;

      // map monitoredZone with fully info monitor zone
      // res = await axios.get(``);

      return {
        ...monitorCampain,
        monitoredObject,
        monitoredZone: { _id: monitoredZoneId, name: 'Tiểu khu A' },
      };
    })
  );

  res.send({
    status: 1,
    result: {
      numberOfMonitorCampaigns,
      monitorCampaigns: monitorCampainsFullInfo,
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
  const { monitorCampaignId } = req.params;

  if (!monitorCampaignId) {
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
