var path = require('path')

module.exports = {
  entry: './src/snowfall.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'snowfall.js',
    library: 'snowfall',
    libraryTarget: 'window'
  }
}
