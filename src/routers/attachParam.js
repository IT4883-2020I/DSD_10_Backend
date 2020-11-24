const express = require('express');
const router = express.Router();

const {
  createOtherAttachParam,
  getAttachParams,
  updateOtherAttachParam,
  removeOtherAttachParam,
} = require('../controllers/attachParam');
const asyncMiddleware = require('../middlewares/async');

router.post('/', asyncMiddleware(createOtherAttachParam));
router.get('/', asyncMiddleware(getAttachParams));
router.patch('/', asyncMiddleware(updateOtherAttachParam));
router.delete('/', asyncMiddleware(removeOtherAttachParam));

module.exports = router;
