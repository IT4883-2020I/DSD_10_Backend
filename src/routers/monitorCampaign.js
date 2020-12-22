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
const auth = require('../middlewares/auth');

router.post('/', auth, asyncMiddleware(createMonitorCampaign));
router.get('/', auth, asyncMiddleware(getMonitorCampaigns));
router.patch('/', asyncMiddleware(updateMonitorCampaign));
router.delete('/', asyncMiddleware(removeMonitorCampaign));
router.get('/:monitorCampaignId', auth, asyncMiddleware(getMonitorCampaignById));

module.exports = router;
