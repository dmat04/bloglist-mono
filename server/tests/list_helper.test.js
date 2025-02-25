const listHelper = require('@util/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of an empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog, equals the likes of that blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('of an empty list of blogs is undefined', () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toBe(undefined)
  })

  test('of a single blog is that blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is the blog with the most likes', () => {
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })
})

describe('author with most blogs', () => {
  test('of an empty list of blogs is undefined', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(undefined)
  })

  test('in a list of a single blog is the single author, with one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expectedResult = {
      author: listWithOneBlog[0].author,
      blogs: 1,
    }
    expect(result).toEqual(expectedResult)
  })

  test('in a bigger list of blogs is calculated correctly', () => {
    const result = listHelper.mostBlogs(blogs)
    const expectedResult = {
      author: 'Robert C. Martin',
      blogs: 3,
    }
    expect(result).toEqual(expectedResult)
  })
})

describe('author with the most likes', () => {
  test('of an empty list of blogs is undefined', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(undefined)
  })

  test('in a list of a single blog is the single author, with the number of likes for the single blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expectedResult = {
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes,
    }
    expect(result).toEqual(expectedResult)
  })

  test('in a bigger list of blogs is calculated correctly', () => {
    const result = listHelper.mostLikes(blogs)
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    expect(result).toEqual(expectedResult)
  })
})
