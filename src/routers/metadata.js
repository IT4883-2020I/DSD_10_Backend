const express = require('express');
const { assignLabelForMetaData } = require('../controllers/metadata');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async');

router.post('/', asyncMiddleware(assignLabelForMetaData));

module.exports = router;
