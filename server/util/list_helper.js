const countBy = require('lodash/countBy')
const maxBy = require('lodash/maxBy')
const toPairs = require('lodash/toPairs')
const transform = require('lodash/transform')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (acc, current) => acc + current.likes

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined

  const reducer = (acc, current) => (current.likes > acc.likes
    ? current
    : acc)

  return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined

  const stats = countBy(blogs, 'author')
  const asPairs = toPairs(stats)
  const max = maxBy(asPairs, (pair) => pair[1])

  return {
    author: max[0],
    blogs: max[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined

  const max = { author: blogs[0].author, likes: blogs[0].likes }

  transform(
    blogs,
    (acc, val) => {
      const currentSum = (acc[val.author] || 0) + val.likes
      acc[val.author] = currentSum

      if (currentSum > max.likes) {
        max.author = val.author
        max.likes = currentSum
      }
    },
    {},
  )

  return max
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
