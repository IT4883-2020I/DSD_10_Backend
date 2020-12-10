const express = require('express');
const router = express.Router();

const {
  getQuantityMonitorCampaign,
  getQuantityMonitorCampaignCurrently,
} = require('../controllers/statistics');
const asyncMiddleware = require('../middlewares/async');

router.get('/monitor-campaigns', asyncMiddleware(getQuantityMonitorCampaign));
router.get(
  '/monitor-campaigns/currently',
  asyncMiddleware(getQuantityMonitorCampaignCurrently)
);

module.exports = router;
