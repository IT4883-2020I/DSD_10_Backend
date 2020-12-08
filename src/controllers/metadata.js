const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const MonitorCampaign = require('../models/monitorCampaign');

const assignLabelForMetaData = async (req, res) => {
  const { monitorCampaignId, data } = req.body;

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
      metadata: {
        data,
        labels: monitorCampaign.labels,
      },
    },
  });
};

module.exports = {
  assignLabelForMetaData,
};
