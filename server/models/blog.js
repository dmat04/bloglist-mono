/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [8, 'Title is too short, 8 characters minumum'],
    required: [true, 'Blog title is missing'],
  },
  author: {
    type: String,
    minLength: [5, 'Author name is too short, 5 characters minimum'],
    required: [true, 'Blog author is missing'],
  },
  url: {
    type: String,
    minLength: [8, 'URL is too short, 8 characters minimum'],
    required: [true, 'Blog URL is missing'],
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Number of likes cannot be negative'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'No user specified'],
  },
  comments: {
    type: [String],
    default: [],
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    // returnedObject.user = returnedObject.user.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
