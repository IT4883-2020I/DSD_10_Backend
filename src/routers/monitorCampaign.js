const express = require('express');
const router = express.Router();

const {
  createMonitorCampaign,
  getMonitorCampaigns,
  updateMonitorCampaign,
  removeMonitorCampaign,
  getMonitorCampaignById,
  getQuickMonitorCampaignById,
} = require('../controllers/monitorCampaign');
const asyncMiddleware = require('../middlewares/async');
const auth = require('../middlewares/auth');

router.post('/', auth, asyncMiddleware(createMonitorCampaign));
router.get('/', auth, asyncMiddleware(getMonitorCampaigns));
router.patch('/', auth, asyncMiddleware(updateMonitorCampaign));
router.delete('/', auth, asyncMiddleware(removeMonitorCampaign));
router.get(
  '/:monitorCampaignId',
  auth,
  asyncMiddleware(getMonitorCampaignById)
);
router.get(
  '/quick/:monitorCampaignId',
  auth,
  asyncMiddleware(getQuickMonitorCampaignById)
);

module.exports = router;
