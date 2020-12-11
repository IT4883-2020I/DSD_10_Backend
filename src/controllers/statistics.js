const MonitorCampaign = require('../models/monitorCampaign');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const axios = require('axios').default;

const getQuantityMonitorCampaign = async (req, res) => {
  let { timeFrom, timeTo } = req.query;
  if (!timeFrom) {
    timeFrom = '2020-1-1';
  }

  if (!timeTo) {
    timeTo = '2025-1-1';
  }

  timeTo = new Date(timeTo);
  timeFrom = new Date(timeFrom);

  const monitorCampains = await MonitorCampaign.find({
    $or: [
      {
        startTime: { $gte: timeFrom, $lte: timeTo },
      },
      {
        endTime: { $gte: timeFrom, $lte: timeTo },
      },
    ],
  });

  const monitorCampaigns = await MonitorCampaign.aggregate([
    {
      $match: {
        $or: [
          {
            startTime: { $gte: timeFrom, $lte: timeTo },
          },
          {
            endTime: { $gte: timeFrom, $lte: timeTo },
          },
        ],
      },
    },
    {
      $group: {
        _id: '$task',
        total: { $sum: 1 },
      },
    },
  ]);

  res.send({
    status: 1,
    result: {
      statistics: monitorCampaigns,
    },
  });
};

const getQuantityMonitorCampaignCurrently = async (req, res) => {
  const current = new Date();
  // const monitorCampains = await MonitorCampaign.find({
  //   startTime: { $lte: current },
  //   endTime: { $gte: current },
  // });

  const monitorCampaigns = await MonitorCampaign.aggregate([
    {
      $match: {
        startTime: { $lte: current },
        endTime: { $gte: current },
      },
    },
    {
      $group: {
        _id: '$task',
        total: { $sum: 1 },
      },
    },
  ]);

  res.send({
    status: 1,
    result: {
      statistics: monitorCampaigns,
    },
  });
};

module.exports = {
  getQuantityMonitorCampaign,
  getQuantityMonitorCampaignCurrently,
};
