const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

AWS.config.update({
  region: process.env.AWS_IOT_REGION,
  endpoint: process.env.AWS_IOT_ENDPOINT,
});

module.exports = AWS;