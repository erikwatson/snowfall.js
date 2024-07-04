const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/snowfall.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  output: {
    filename: 'snowfall.js',
    path: path.resolve(__dirname, 'dist')
  }
}
