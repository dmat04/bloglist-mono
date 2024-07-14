const Dotenv = require('dotenv-webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const sass = require('sass')
const webpack = require('webpack')

module.exports = (env, argv) => {
  const { mode } = argv
  const additionalPlugins = mode === 'production'
    ? [new Dotenv({})]
    : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

  const additionalEntries = mode === 'production' ? [] : ['webpack-hot-middleware/client?http://localhost:8000']

  return {
    mode,
    entry: [
      '@babel/polyfill', // so we don't need to import it anywhere
      './client',
      ...additionalEntries,
    ],
    resolve: {
      alias: {
        Utilities: path.resolve(__dirname, 'client/util/'),
        Components: path.resolve(__dirname, 'client/components/'),
        Assets: path.resolve(__dirname, 'client/assets/'),
        '@root': path.resolve(__dirname),
      },
      fallback: {
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        vm: require.resolve('vm-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
      },
    },
    module: {
      rules: [
        {
          // Load JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        { // Load SCSS & SASS files
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                // Prefer `dart-sass`
                implementation: sass,
              },
            },
          ],
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      ...additionalPlugins,
      // new Dotenv({}),
      new webpack.DefinePlugin({
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
        // 'process.env.MONGODB_URI': process.env.MONGODB_URI, //  'mongodb+srv://matejdjerdji:Cff8jzcmlZDSMVD6@cluster0.03cooj8.mongodb.net/prod?retryWrites=true&w=majority',
      }),
      // Skip the part where we would make a html template
      new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: path.resolve(__dirname, 'client/assets/favicon.ico'),
      }),
    ],
  }
}
