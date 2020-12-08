const express = require('express');
const router = express.Router();

const {
  createMonitorCampaign,
  getMonitorCampaigns,
  updateMonitorCampaign,
  removeMonitorCampaign,
  getMonitorCampaignById,
} = require('../controllers/monitorCampaign');
const asyncMiddleware = require('../middlewares/async');

router.post('/', asyncMiddleware(createMonitorCampaign));
router.get('/', asyncMiddleware(getMonitorCampaigns));
router.patch('/', asyncMiddleware(updateMonitorCampaign));
router.delete('/', asyncMiddleware(removeMonitorCampaign));
router.get('/:monitorCampaignId', asyncMiddleware(getMonitorCampaignById));

module.exports = router;
