const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const Label = require('../models/label');
const MonitorCampaign = require('../models/monitorCampaign');

const createOtherLabel = async (req, res) => {
  const { name, description, type } = req.body;

  const isExistLabel = await Label.findOne({ name });
  if (isExistLabel) {
    throw new CustomError(codes.BAD_REQUEST, 'Name of label was duplicated');
  }

  const otherLabel = await Label.create({
    name,
    description,
    isDefault: false,
    type
  });
  res.send({
    status: 1,
    result: {
      otherLabel,
    },
  });
};

const getLabels = async (req, res) => {
  const labels = await Label.find({});

  res.send({
    status: 1,
    result: {
      labels,
    },
  });
};

const updateOtherLabel = async (req, res) => {
  const { _id, name, description, type } = req.body;

  if (!_id) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing _id');
  }

  const otherLabel = await Label.findByIdAndUpdate(
    _id,
    {
      name,
      description,
      type
    },
    {
      new: true,
    }
  );

  if (!otherLabel) {
    throw new CustomError(codes.NOT_FOUND);
  }

  res.send({
    status: 1,
    result: {
      otherLabel,
    },
  });
};

const removeOtherLabel = async (req, res) => {
  const { _id } = req.body;
  const otherLabel = await Label.findByIdAndRemove(_id);
  if (!otherLabel) {
    throw new CustomError(codes.NOT_FOUND);
  }

  res.send({
    status: 1,
    result: {
      otherLabel,
    },
  });
};

const getLabelsByMonitorCampaign = async (req, res) => {
  const { monitorCampaignId } = req.params;

  if (!monitorCampaignId) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing monitorcampaign id');
  }

  const monitorCampaign = await MonitorCampaign.findById(
    monitorCampaignId
  ).populate('labels');

  if (!monitorCampaign) {
    throw new CustomError(codes.BAD_REQUEST, 'Monitorcampaign does not exist');
  }

  res.send({
    status: 1,
    result: {
      labels: monitorCampaign.labels,
    },
  });
};

module.exports = {
  createOtherLabel,
  getLabels,
  updateOtherLabel,
  removeOtherLabel,
  getLabelsByMonitorCampaign,
};
