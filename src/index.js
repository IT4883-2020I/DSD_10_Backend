require('dotenv').config();
require('./models/mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const errorHandler = require('./middlewares/errorHandler');

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/monitor-campaigns', require('./routers/monitorCampaign'));
app.use('/api/labels', require('./routers/label'));
app.use('/api/metadata', require('./routers/metadata'));
app.use('/api/statistics', require('./routers/statistics'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
