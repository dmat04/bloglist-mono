const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const user = request.user

  if (!user) {
    return response
      .status(401)
      .json({ error: 'no user authenticated' })
  }

  blog.user = user.id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  const populated = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populated)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response
      .status(401)
      .json({ error: 'token invalid - user not found' })
  }

  const blogToRemove = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  if (!blogToRemove) {
    return response.status(404).end()
  } else if (blogToRemove.user.id === user.id) {
    await Blog.findByIdAndRemove(blogToRemove.id)
    user.blogs = user.blogs.filter(b => b.id !== blogToRemove.id)
    await user.save()
    return response.status(204).end()
  } else {
    return response
      .status(401)
      .json({ error: 'blog can only be deleted by user who created it' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response
      .status(401)
      .json({ error: 'no user authenticated' })
  }

  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate) {
    return response
      .status(404)
      .json({ error: 'blog not found' })
  }

  // if (blogToUpdate.user.toString() !== user.id) {
  //   return response
  //     .status(401)
  //     .json({ error: 'the authenticated user cannot edit this blog' })
  // }

  if (body.title) blogToUpdate.title = body.title
  if (body.author) blogToUpdate.author = body.author
  if (body.url) blogToUpdate.url = body.url
  if (body.likes) blogToUpdate.likes = body.likes

  const updatedBlog = await blogToUpdate.save()

  if (updatedBlog) {
    const populated = await updatedBlog.populate('user', { username: 1, name: 1 })
    response.json(populated)
  } else {
    response.status(500).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response
      .status(401)
      .json({ error: 'no user authenticated' })
  }

  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate) {
    return response
      .status(404)
      .json({ error: 'blog not found' })
  }

  if (body.comment) {
    blogToUpdate.comments.push(body.comment)
    const updatedBlog = await blogToUpdate.save()

    if (updatedBlog) {
      const populatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 })

      const commentResponse = {
        comment: body.comment,
        blog: populatedBlog
      }
      response.json(commentResponse)
    } else {
      response.status(500).end()
    }
  } else {
    return response
      .status(400)
      .json({ error: 'no comment supplied in request' })
  }
})

// blogsRouter.post('/like/:id', async (request, response) => {
//   const user = request.user

//   if (!user) {
//     return response
//       .status(401)
//       .json({ error: 'no user authenticated' })
//   }

//   const blogToUpdate = await Blog.findById(request.params.id)

//   if (!blogToUpdate) {
//     return response
//       .status(404)
//       .json({ error: 'blog not found' })
//   }

//   blogToUpdate.likes = blogToUpdate.likes + 1

//   const updatedBlog = await blogToUpdate.save()

//   if (updatedBlog) {
//     const populated = await updatedBlog.populate('user', { username: 1, name: 1 })
//     response.json(populated)
//   } else {
//     response.status(500).end()
//   }
// })

module.exports = blogsRouter