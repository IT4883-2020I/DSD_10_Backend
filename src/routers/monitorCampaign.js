const express = require('express');
const router = express.Router();

const {
  createMonitorCampaign,
  getMonitorCampaigns,
  updateMonitorCampaign,
} = require('../controllers/monitorCampaign');
const asyncMiddleware = require('../middlewares/async');

router.post('/', asyncMiddleware(createMonitorCampaign));
router.get('/', asyncMiddleware(getMonitorCampaigns));
router.patch('/', asyncMiddleware(updateMonitorCampaign));

module.exports = router;
