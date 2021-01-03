const MonitorCampaign = require('../models/monitorCampaign');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const axios = require('axios').default;
const { omitIsNil } = require('../utils/omitIsNil');
const schedule = require('node-schedule');

const {
  LOG_ADD_URL,
  LOG_EDIT_URL,
  LOG_DELETE_URL,
} = require('../utils/constants');

const createMonitorCampaign = async (req, res) => {
  const {
    labels,
    description,
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

  let task;
  if (req.task) {
    task = req.task;
  } else {
    task = req.body.task;
  }

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
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const droneReqs = drones.map((drone) => {
    return {
      idDrone: drone.id,
      listIdFlightPath: drone.flightPaths,
      // payloads: drone.payloads,
    };
  });

  let taskReq = 0;
  let projectType;
  switch (task) {
    case 'Cháy rừng':
      taskReq = 1;
      projectType = 'CHAY_RUNG';
      break;
    case 'Đê điều':
      taskReq = 2;
      projectType = 'DE_DIEU';
      break;
    case 'Điện':
      taskReq = 3;
      projectType = 'CAY_TRONG';
      break;
    case 'Cây trồng':
      taskReq = 4;
      projectType = 'LUOI_DIEN';
      break;
    default:
      break;
  }

  const bodyReq = {
    idCampaign: monitorCampaign._id,
    linkDronePaths: droneReqs,
    idSupervisedArea: monitoredZone,
    name: monitorCampaign.name,
    task: taskReq,
    timeEnd: endTime,
    timeStart: startTime,
  };

  await axios.post(
    `http://skyrone.cf:6789/flightItinerary/save`,
    bodyReq,
    config
  );

  try {
    await Promise.all(
      drones.map(async (drone) => {
        await Promise.all(
          drone.payloads.map(async (payload) => {
            console.log({ payload });
            const res = await axios.post(
              `https://dsd06.herokuapp.com/api/payloadregister/working/${payload}`,
              { droneId: drone.id },
              config
            );

            try {
              const timeReturn = new Date(endTime || Date.now() + 100);

              schedule.scheduleJob(timeReturn, () => {
                console.log(
                  'cron job return payload start. Payload ID ',
                  payload
                );
                axios.post(
                  `https://dsd06.herokuapp.com/api/payloadregister/return/${payload}`
                  // { fee: 1 }
                );
              });
            } catch (error) {
              console.log('cron job return payload', error);
            }
          })
        );
      })
    );
  } catch (error) {
    res.send(error.response.data);
  }

  try {
    const logBody = {
      regionId: monitoredZone,
      entityId: drones.length.toString(),
      description: 'Tạo đợt giám sát',
      authorId: req.header('user'), // TODO
      projectType,
      state: '1',
      name: name,
    };
    await axios.post(LOG_ADD_URL, logBody, config);
  } catch (error) {
    console.log(error);
  }

  res.send({
    status: 1,
    result: {
      monitorCampaign,
    },
  });
};

const getMonitorCampaigns = async (req, res) => {
  let {
    name,
    mechanism,
    metadataType,
    resolution,
    startTime,
    endTime,
  } = req.query;
  const task = req.task;
  if (!startTime) {
    startTime = '2020-1-1';
  }

  if (!endTime) {
    endTime = '2025-1-1';
  }

  endTime = new Date(endTime);
  startTime = new Date(startTime);
  let monitorCampains;

  const query = omitIsNil(
    {
      task,
      name: { $regex: name },
      mechanism,
      metadataType,
      resolution,
      $or: [
        {
          startTime: { $gte: startTime, $lte: endTime },
        },
        {
          endTime: { $gte: startTime, $lte: endTime },
        },
      ],
    },
    true
  );

  if (!name) {
    delete query.name;
  }

  monitorCampaigns = await MonitorCampaign.find(query)
    .sort({ createdAt: 'desc' })
    .populate('labels')
    .lean();

  const numberOfMonitorCampaigns = monitorCampaigns.length;

  // const monitorCampainsFullInfo = await Promise.all(
  //   monitorCampains.map(async (monitorCampain) => {
  //     const {
  //       drones: droneFullInfo,
  //       monitoredObjects: monitoredObjectIds,
  //       monitoredZone: monitoredZoneId,
  //     } = monitorCampain;
  //     let res;

  //     // map droneIds with fully info drones
  //     let drones;
  //     try {
  //       drones = await Promise.all(
  //         droneFullInfo.map(async (drone) => {
  //           res = await axios.get(
  //             `http://skyrone.cf:6789/drone/getById/${drone.id}`
  //           );
  //           return { ...res.data, ...drone };
  //         })
  //       );
  //     } catch (error) {
  //       drones = [];
  //     }

  //     // map monitoredObject with fully info monitor object
  //     let monitoredObjects;
  //     try {
  //       monitoredObjects = await Promise.all(
  //         monitoredObjectIds.map(async (monitoredObjectId) => {
  //           res = await axios.get(
  //             `https://dsd05-monitored-object.herokuapp.com/monitored-object/detail-monitored-object/${monitoredObjectId}`
  //           );
  //           return { ...res.data.content };
  //         })
  //       );
  //     } catch (error) {
  //       monitoredObjects = [];
  //     }

  //     let monitoredZone;
  //     try {
  //       // map monitoredZone with fully info monitor zone
  //       res = await axios.get(
  //         `https://monitoredzoneserver.herokuapp.com/monitoredzone/zoneinfo/${monitoredZoneId}`,
  //         { headers: { token: req.token, projecttype: req.projectType } }
  //       );
  //       monitoredZone = res.data.content.zone;
  //     } catch (error) {
  //       monitoredZone = {};
  //     }

  //     return {
  //       ...monitorCampain,
  //       monitoredObjects,
  //       monitoredZone,
  //       drones,
  //     };
  //   })
  // );

  res.send({
    status: 1,
    result: {
      numberOfMonitorCampaigns,
      // monitorCampaigns: monitorCampainsFullInfo,
      monitorCampaigns,
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

  switch (monitorCampaign.task) {
    case 'Cháy rừng':
      projectType = 'CHAY_RUNG';
      break;
    case 'Đê điều':
      projectType = 'DE_DIEU';
      break;
    case 'Điện':
      projectType = 'CAY_TRONG';
      break;
    case 'Cây trồng':
      projectType = 'LUOI_DIEN';
      break;
    default:
      break;
  }

  try {
    const logBody = {
      regionId: monitoredZone,
      entityId: drones.length.toString(),
      description: 'Sửa đợt giám sát',
      authorId: req.header('user'),
      projectType,
      state: '1',
      name: name,
    };
    await axios.post(LOG_EDIT_URL, logBody);
  } catch (error) {
    console.log(error);
  }

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

  try {
    await Promise.all(
      monitorCampaign.drones.map(async (drone) => {
        await Promise.all(
          drone.payloads.map(async (payload) => {
            try {
              axios.post(
                `https://dsd06.herokuapp.com/api/payloadregister/return/${payload}`
                // { fee: 1 }
              );
            } catch (error) {
              console.log('cron job return payload', error);
            }
          })
        );
      })
    );
  } catch (error) {
    res.send(error.response.data);
  }

  switch (monitorCampaign.task) {
    case 'Cháy rừng':
      projectType = 'CHAY_RUNG';
      break;
    case 'Đê điều':
      projectType = 'DE_DIEU';
      break;
    case 'Điện':
      projectType = 'CAY_TRONG';
      break;
    case 'Cây trồng':
      projectType = 'LUOI_DIEN';
      break;
    default:
      break;
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const logBody = {
      regionId: monitorCampaign.monitoredZone,
      entityId: monitorCampaign.drones.length.toString(),
      description: 'Xóa đợt giám sát',
      authorId: req.header('user'), // TODO
      projectType,
      state: '1',
      name: monitorCampaign.name,
    };
    await axios.post(LOG_DELETE_URL, logBody, config);
  } catch (error) {
    console.log(error);
  }

  try {
    await axios.get(
      `http://skyrone.cf:6789/flightItinerary/delteByCampaign/${_id}`
    );
  } catch (error) {
    console.log(error);
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

  const monitorCampaign = await MonitorCampaign.findById(monitorCampaignId)
    .populate('labels')
    .lean();

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
      // console.log({drone: response.data});

      let getPayloadByIdError = 0;
      let payloads;
      payloads = await Promise.all(
        drone.payloads.map(async (payload) => {
          try {
            const resp = await axios.get(
              `https://dsd06.herokuapp.com/api/payload/${payload}`
            );
            return resp.data;
          } catch (error) {
            getPayloadByIdError = 1;
          }
        })
      );

      if (getPayloadByIdError) {
        payloads = [];
      }

      response = await axios.get(
        `http://skyrone.cf:6789/drone/getById/${drone.id}`
      );

      return { ...response.data, ...drone, payloads };
    })
  );

  // map monitoredObject with fully info monitor object
  const monitoredObjects = await Promise.all(
    monitoredObjectIds.map(async (monitoredObjectId) => {
      response = await axios.get(
        `https://dsd05-monitored-object.herokuapp.com/monitored-object/detail-monitored-object/${monitoredObjectId}`
      );
      return { ...response.data.content };
    })
  );

  // map monitoredZone with fully info monitor zone
  response = await axios.get(
    `https://monitoredzoneserver.herokuapp.com/monitoredzone/zoneinfo/${monitoredZoneId}`,
    { headers: { token: req.token, projecttype: req.projectType } }
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

const getQuickMonitorCampaignById = async (req, res) => {
  const { monitorCampaignId } = req.params;

  if (!monitorCampaignId) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing monitorCampaignId');
  }

  const monitorCampaign = await MonitorCampaign.findById(monitorCampaignId)
    .populate('labels')
    .lean();

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
  getQuickMonitorCampaignById,
};
