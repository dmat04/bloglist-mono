const errorHandler = (error, req, res, next) => {
  console.error(error.message, error.name, error.extra)

  if (error.name === 'ApplicationError') {
    return res.status(error.status).send({ error: error.message })
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  res.status(500).send({ error: error.message })
  return next(error)
}

module.exports = errorHandler
