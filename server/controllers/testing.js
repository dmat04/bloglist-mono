const testingRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany()
  await User.deleteMany()

  console.log('TEST DB RESET')
  response.status(204).end()
})

module.exports = testingRouter
