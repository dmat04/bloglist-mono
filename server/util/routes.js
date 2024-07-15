const Router = require('express')
const blogsRouter = require('@controllers/blogs')
const usersRouter = require('@controllers/user')
const loginRouter = require('@controllers/login')

const userExtractor = require('@middleware/userExtractor')

const app = Router()

app.use('/login', loginRouter)
app.use('/blogs', userExtractor, blogsRouter)
app.use('/users/', usersRouter)

app.get('/health', () => {
  throw new Error('Failing health check')
  // res.send('ok')
})

module.exports = app
