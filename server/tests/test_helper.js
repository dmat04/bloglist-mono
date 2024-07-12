/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'Admin',
  },
  {
    username: 'user1',
    name: 'Some Guy',
  },
  {
    username: 'user2',
    name: 'Another Guy',
  },
]

const initialBlogs = [
  {
    title: 'One day, my log will have something to say about this',
    author: 'Log Lady',
    url: 'www.blogpost.com/loglady',
    likes: 125,
  },
  {
    title: 'Who\'s the lady with the log?',
    author: 'Dale Cooper',
    url: 'www.twitter.com/specialagent',
    likes: 999,
  },
  {
    title: 'We are like the dreamer who dreams and then lives inside the dream',
    author: 'Gordon Cole',
    url: 'www.myspace.com/canthear',
    likes: 420,
  },
  {
    title: 'Well begun is half done',
    author: 'Jerry Horne',
    url: 'www.twitter.com/u/jhorn',
    likes: 256,
  },
]

const resetRecords = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (const u of initialUsers) {
    u.passwordHash = await bcrypt.hash(`${u.username}${u.name}`, 10)
  }

  await User.insertMany(initialUsers)

  for (const b of initialBlogs) {
    const someUser = await User.findOne({})
    b.user = someUser.id.toString()
  }

  await Blog.insertMany(initialBlogs)
}

const nonExistingBlogId = async () => {
  const user = await User.findOne({})

  const blog = new Blog({
    title: 'willbegonesoon',
    author: 'willbegonesoon',
    url: 'willbegonesoon',
    likes: 1,
    user: user.id,
  })

  await blog.save()
  await blog.deleteOne()

  return blog.id
}

const nonExistingUserId = async () => {
  const user = new User({
    username: 'tobedeleted',
    name: 'tobedeleted',
    password: 'tobedeleted',
  })

  await user.save()
  await user.deleteOne()

  return user.id
}

const blogsInDb = async () => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1, author: 1, url: 1, likes: 1,
    })
  return users.map((u) => u.toJSON())
}

const getAccessToken = async (userId) => {
  const users = await usersInDb()

  if (!userId) {
    // eslint-disable-next-line no-param-reassign
    userId = users[0].id
  }

  const user = users.find((u) => u.id === userId)

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  return jwt.sign(userForToken, process.env.SECRET)
}

const getInvalidAccessToken = async () => jwt.sign(
  { username: 'randomusername' },
  process.env.SECRET,
)

module.exports = {
  nonExistingBlogId,
  blogsInDb,
  nonExistingUserId,
  usersInDb,
  resetRecords,
  getAccessToken,
  getInvalidAccessToken,
}
