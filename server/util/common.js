require('dotenv').config()
const common = require('@root/config/common')

const PORT = process.env.PORT || 8000

const MONGODB_URI = common.inProduction
  ? process.env.MONGODB_URI
  : process.env.TEST_MONGODB_URI

module.exports = {
  ...common,
  PORT,
  MONGODB_URI,
}
