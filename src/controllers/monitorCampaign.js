const MonitorCampaign = require('../models/monitorCampaign');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const axios = require('axios').default;

const createMonitorCampaign = async (req, res) => {
  const {
    labels,
    description,
    task,
    drones,
    endTime,
    mechanism,
    metadataType,
    monitoredObjects,
    monitoredZone,
    name,
    resolution,
    startTime,
  } = req.body;

  const monitorCampaign = await MonitorCampaign.create({
    labels,
    description,
    task,
    drones,
    endTime,
    mechanism,
    metadataType,
    monitoredObjects,
    monitoredZone,
    name,
    resolution,
    startTime,
  });

  // Tao hanh trinh bay, cap nhat trang thai drone
  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  // const bodyReq = {
  //   idCampaign: monitorCampaign._id,
  //   idDroneList: drones.map((drone) => drone._id),
  //   idLightPath: [],
  //   idSupervisedArea: monitoredZone,
  //   name: 'string',
  //   task,
  //   timeEnd: endTime,
  //   timeStart: startTime,
  // };
  // const response = await axios.post(
  //   `http://skyrone.cf:6789/flightItinerary/save`,
  //   bodyReq,
  //   config
  // );

  // console.log({ response });

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

  const monitorCampains = await MonitorCampaign.find({
    $or: [
      {
        startTime: { $gte: timeFrom, $lte: timeTo },
      },
      {
        endTime: { $gte: timeFrom, $lte: timeTo },
      },
    ],
  })
    .populate('labels')
    .lean();

  const numberOfMonitorCampaigns = monitorCampains.length;

  const monitorCampainsFullInfo = await Promise.all(
    monitorCampains.map(async (monitorCampain) => {
      const {
        drones: droneFullInfo,
        monitoredObjects: monitoredObjectIds,
        monitoredZone: monitoredZoneId,
      } = monitorCampain;
      let res;

      // map droneIds with fully info drones

      const drones = await Promise.all(
        droneFullInfo.map(async (drone) => {
          res = await axios.get(
            `http://skyrone.cf:6789/drone/getById/${drone.id}`
          );
          return { ...res.data, ...drone };
        })
      );

      // map monitoredObject with fully info monitor object
      const monitoredObjects = await Promise.all(
        monitoredObjectIds.map(async (monitoredObjectId) => {
          res = await axios.get(
            `https://dsd05-monitored-object.herokuapp.com/monitored-object/detail-monitored-object/${monitoredObjectId}`
          );
          return { ...res.data };
        })
      );

      // map monitoredZone with fully info monitor zone
      res = await axios.get(
        `https://monitoredzoneserver.herokuapp.com/monitoredzone/zoneinfo/${monitoredZoneId}`
      );

      const monitoredZone = res.data.content.zone;

      return {
        ...monitorCampain,
        monitoredObjects,
        monitoredZone,
        drones,
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
    task,
    drones,
    endTime,
    mechanism,
    metadataType,
    monitoredObjects,
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
      task,
      drones,
      endTime,
      mechanism,
      metadataType,
      monitoredObjects,
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
    throw new CustomError(codes.BAD_REQUEST, 'Missing monitorCampaignId');
  }

  const monitorCampaign = await MonitorCampaign.findById(
    monitorCampaignId
  ).lean();

  if (!monitorCampaign) {
    throw new CustomError(codes.NOT_FOUND);
  }

  const {
    drones: droneFullInfo,
    monitoredObjects: monitoredObjectIds,
    monitoredZone: monitoredZoneId,
  } = monitorCampaign;
  let response;

  // map droneIds with fully info drones

  const drones = await Promise.all(
    droneFullInfo.map(async (drone) => {
      response = await axios.get(
        `http://skyrone.cf:6789/drone/getById/${drone.id}`
      );
      return { ...response.data, ...drone };
    })
  );

  // map monitoredObject with fully info monitor object
  const monitoredObjects = await Promise.all(
    monitoredObjectIds.map(async (monitoredObjectId) => {
      response = await axios.get(
        `https://dsd05-monitored-object.herokuapp.com/monitored-object/detail-monitored-object/${monitoredObjectId}`
      );
      return { ...response.data };
    })
  );

  // map monitoredZone with fully info monitor zone
  response = await axios.get(
    `https://monitoredzoneserver.herokuapp.com/monitoredzone/zoneinfo/${monitoredZoneId}`
  );

  const monitoredZone = response.data.content.zone;

  // return {
  //   ...monitorCampain,
  //   monitoredObject,
  //   monitoredZone,
  //   drones,
  // };
  res.send({
    status: 1,
    result: {
      monitorCampaign: {
        ...monitorCampaign,
        monitoredObjects,
        monitoredZone,
        drones,
      },
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
