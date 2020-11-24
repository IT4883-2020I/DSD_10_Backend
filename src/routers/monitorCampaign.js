const express = require('express');
const router = express.Router();

const {
  createMonitorCampaign,
  getMonitorCampaigns,
  updateMonitorCampaign,
  removeMonitorCampaign,
} = require('../controllers/monitorCampaign');
const asyncMiddleware = require('../middlewares/async');

router.post('/', asyncMiddleware(createMonitorCampaign));
router.get('/', asyncMiddleware(getMonitorCampaigns));
router.patch('/', asyncMiddleware(updateMonitorCampaign));
router.delete('/', asyncMiddleware(removeMonitorCampaign));

module.exports = router;
