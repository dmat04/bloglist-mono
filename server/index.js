/* eslint-disable no-console */
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')

const routes = require('@util/routes')
const errorMiddleware = require('@middleware/errorMiddleware')
const config = require('@util/common')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error)
  })

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)

app.use(errorMiddleware)

module.exports = app
