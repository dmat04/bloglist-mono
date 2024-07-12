const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('@root/server')

const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
  await helper.resetRecords()
})

describe('when there are initially some users in the db', () => {
  test('users are returned as json', async () => {
    await api
      .get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const expectedUsers = await helper.usersInDb()

    const response = await api.get('/users')

    const data = response.body
    expect(data).toHaveLength(expectedUsers.length)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'userguy',
      name: 'somedude',
      password: 'muchsecret',
    }

    const response = await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length + 1)
    expect(usersAfter).toContainEqual(response.body)
  })

  describe('creation fails with proper statuscode and message', () => {
    test(
      'if username already taken',
      async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Admin',
          password: 'muchsecret',
        }

        const response = await api
          .post('/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body.error).toContain('expected `username` to be unique')
      },
    )

    test(
      'if username doesn\'t meet requirements',
      async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
          username: 'ab',
          name: 'Admin',
          password: 'muchsecret',
        }

        const response = await api
          .post('/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body.error).toContain('Username must be at least 3 characters long')
      },
    )

    test(
      'if username is missing',
      async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
          name: 'Admin',
          password: 'muchsecret',
        }

        const response = await api
          .post('/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body.error).toContain('Username missing')
      },
    )

    test(
      'if password doesn\'t meet requirements',
      async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
          username: 'NewUsername',
          name: 'SomeUser',
          password: '12',
        }

        const response = await api
          .post('/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body.error).toContain('Password must be at least 3 characters long')
      },
    )

    test(
      'if password is missing',
      async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
          username: 'NewUsername',
          name: 'SomeUser',
        }

        const response = await api
          .post('/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length)
        expect(response.body.error).toContain('Password missing')
      },
    )
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
