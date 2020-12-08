const express = require('express');
const router = express.Router();

const {
  createOtherLabel,
  getLabels,
  updateOtherLabel,
  removeOtherLabel,
  getLabelsByMonitorCampaign,
} = require('../controllers/label');
const asyncMiddleware = require('../middlewares/async');

router.post('/', asyncMiddleware(createOtherLabel));
router.get('/', asyncMiddleware(getLabels));
router.patch('/', asyncMiddleware(updateOtherLabel));
router.delete('/', asyncMiddleware(removeOtherLabel));
router.get('/:monitorCampaignId', asyncMiddleware(getLabelsByMonitorCampaign));

module.exports = router;
