const mongoose = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest')
const app = require('@root/server')

const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
  await helper.resetRecords()
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const expectedBlogs = await helper.blogsInDb()

    const response = await api.get('/blogs')

    const data = response.body
    expect(data).toHaveLength(expectedBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const expectedBlogs = await helper.blogsInDb()
    const specificBlog = expectedBlogs[0]

    const response = await api.get('/blogs')

    const data = response.body
    expect(data).toContainEqual(specificBlog)
  })

  test('a blog has the id property defined, and not _id', async () => {
    const response = await api.get('/blogs')

    const blog = response.body[0]
    expect(blog.id).toBeDefined()
    // eslint-disable-next-line no-underscore-dangle
    expect(blog._id).not.toBeDefined()
  })
})

describe('fetching a single blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToFetch = blogsBefore[0]

    const response = await api
      .get(`/blogs/${blogToFetch.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual(blogToFetch)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingBlogId()

    await api
      .get(`/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '669135d954e133af6f7fa4e'

    await api
      .get(`/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new blog post', () => {
  test('succeeds with valid data', async () => {
    const blogsBefore = await helper.blogsInDb()
    const token = await helper.getAccessToken()

    const newBlog = {
      title: 'This is a new blog post',
      author: 'New Author',
      url: 'www.someurl.example/post',
      likes: 100,
    }

    const response = await api
      .post('/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(blogsBefore.length + 1)
    expect(blogsAfter).toContainEqual(response.body)
  })

  test(
    'fails without an access token and returns an appropriate status code and message',
    async () => {
      const blogsBefore = await helper.blogsInDb()

      const newBlog = {
        title: 'This is a new blog post',
        author: 'New Author',
        url: 'www.someurl.example/post',
        likes: 100,
      }

      const response = await api
        .post('/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()

      expect(blogsAfter).toHaveLength(blogsBefore.length)
      expect(response.body.error).toMatch(/auth/)
    },
  )

  test(
    'fails with an invalid access token and returns an appropriate status code and message',
    async () => {
      const blogsBefore = await helper.blogsInDb()
      const invalidToken = await helper.getInvalidAccessToken()

      const newBlog = {
        title: 'This is a new blog post',
        author: 'New Author',
        url: 'www.someurl.example/post',
        likes: 100,
      }

      const response = await api
        .post('/blogs')
        .set({ Authorization: `Bearer ${invalidToken}` })
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()

      expect(blogsAfter).toHaveLength(blogsBefore.length)
      expect(response.body.error).toMatch(/auth/)
    },
  )

  test(
    'succeeds if the likes property is omitted, it is defaulted to 0',
    async () => {
      const blogsBefore = await helper.blogsInDb()
      const token = await helper.getAccessToken()

      const newBlog = {
        title: 'This is a new blog post without LIKES specified',
        author: 'New Author',
        url: 'www.someurl.example/post',
      }

      const response = await api
        .post('/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()

      expect(response.body.likes).toBeDefined()
      expect(response.body.likes).toBe(0)
      expect(blogsAfter).toHaveLength(blogsBefore.length + 1)
      expect(blogsAfter).toContainEqual(response.body)
    },
  )

  test(
    'fails with status code 400 if the title property is missing',
    async () => {
      const newBlog = {
        author: 'New Author',
        url: 'www.someurl.example/post',
        likes: 100,
      }

      const token = await helper.getAccessToken()

      await api
        .post('/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(400)
    },
  )

  test(
    'fails with status code 400 if the url property is missing',
    async () => {
      const newBlog = {
        title: 'This is a new blog post without URL specified',
        author: 'New Author',
        likes: 100,
      }

      const token = await helper.getAccessToken()

      await api
        .post('/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(400)
    },
  )
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]
    const token = await helper.getAccessToken(blogToDelete.user.id)

    await api
      .delete(`/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
    expect(blogsAfter).not.toContainEqual(blogToDelete)

    const usersAfter = await helper.usersInDb()
    const ownerAfter = usersAfter.find((u) => u.id === blogToDelete.user.id)

    const ownerBlogsAfter = ownerAfter.blogs.map((b) => b.id)
    expect(ownerBlogsAfter).not.toContain(blogToDelete.id)
  })

  test('fails with status code 401 if user is not authenticated', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`/blogs/${blogToDelete.id}`)
      .expect(401)
  })

  test('fails with status code 401 if wrong user is authenticated', async () => {
    const blogToDelete = (await helper.blogsInDb())[0]
    const user = (await helper.usersInDb()).find((u) => u.id !== blogToDelete.user.id)
    const token = await helper.getAccessToken(user.id)

    await api
      .delete(`/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(401)
  })
})

describe('updating a blog', () => {
  test('succeeds when updating a valid id with valid data while authenticated', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = blogsBefore[0]
    const { user } = blogToUpdate
    const token = await helper.getAccessToken(user.id)

    const updatedBlog = {
      id: blogToUpdate.id,
      title: `${blogToUpdate.title}UPDATED`,
      author: `${blogToUpdate.author}UPDATED`,
      url: `${blogToUpdate.url}UPDATED`,
      likes: blogToUpdate.likes + 1,
      user: user.id,
    }

    const response = await api
      .put(`/blogs/${blogToUpdate.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updatedBlog)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()
    updatedBlog.user = user

    expect(blogsAfter).toContainEqual(response.body)
    // expect(blogsAfter).toContainEqual(updatedBlog)
    expect(blogsAfter).toHaveLength(blogsBefore.length)
    expect(response.body.id).toBe(blogToUpdate.id)
  })

  test('succeeds when updating only a single property for a valid id and authenitcated user', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = blogsBefore[0]
    const { user } = blogToUpdate
    const token = await helper.getAccessToken(user.id)

    const updateData = {
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/blogs/${blogToUpdate.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updateData)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toContainEqual(response.body)

    expect(blogsAfter).toHaveLength(blogsBefore.length)
    expect(response.body.id).toBe(blogToUpdate.id)

    expect(response.body.title).toBe(blogToUpdate.title)
    expect(response.body.author).toBe(blogToUpdate.author)
    expect(response.body.url).toBe(blogToUpdate.url)
    expect(response.body.likes).toBe(updateData.likes)
  })

  test('fails with status code 404 when updating a non-existing id', async () => {
    const token = await helper.getAccessToken()
    const nonExistingId = await helper.nonExistingBlogId()

    const data = {
      title: 'New title',
      author: 'New author',
      url: 'www.someurl.example',
      likes: 101,
    }

    await api
      .put(`/blogs/${nonExistingId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .expect(404)
  })

  test('fails with status code 400 if data is invalid', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = blogsBefore[0]
    const { user } = blogToUpdate
    const token = await helper.getAccessToken(user.id)

    const data = {
      title: '',
      author: '',
      url: '',
      likes: -1,
    }

    await api
      .put(`/blogs/${blogToUpdate.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(data)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toEqual(blogsBefore)
  })

  test('fails with status code 401 if no user is authenticated', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = blogsBefore[0]

    const updatedBlog = {
      id: blogToUpdate.id,
      title: `${blogToUpdate.title}UPDATED`,
      author: `${blogToUpdate.author}UPDATED`,
      url: `${blogToUpdate.url}UPDATED`,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id,
    }

    const response = await api
      .put(`/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(401)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toEqual(blogsBefore)
    expect(response.body.error).toMatch(/auth/)
  })

  // test('fails with status code 401 if wrong user is authenticated', async () => {
  //   const blogsBefore = await helper.blogsInDb()
  //   const blogToUpdate = blogsBefore[0]
  //   const user = (await helper.usersInDb())
  //     .find(u => u.id !== blogToUpdate.user.id)
  //   const token = await helper.getAccessToken(user.id)

  //   const updatedBlog = {
  //     id: blogToUpdate.id,
  //     title: blogToUpdate.title + 'UPDATED',
  //     author: blogToUpdate.author + 'UPDATED',
  //     url: blogToUpdate.url + 'UPDATED',
  //     likes: blogToUpdate.likes + 1,
  //     user: blogToUpdate.user.id
  //   }

  //   const response = await api
  //     .put(`/api/blogs/${blogToUpdate.id}`)
  //     .set({ Authorization: `Bearer ${token}` })
  //     .send(updatedBlog)
  //     .expect(401)

  //   const blogsAfter = await helper.blogsInDb()
  //   expect(blogsAfter).toEqual(blogsBefore)
  //   expect(response.body.error).toMatch(/auth/)
  // })
})

afterAll(async () => {
  await mongoose.connection.close()
})
