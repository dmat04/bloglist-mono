module.exports = (api) => {
  api.cache(false)

  const presets = [
    ['@babel/preset-env', { modules: 'commonjs' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ]

  return {
    presets,
  }
}
