const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./dbconfig');
// dbConfig.connect();
app.use(express.json());
const PORT = process.env.PORT;
const routes = require('./router/routes');

app.use('/api', routes);
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});