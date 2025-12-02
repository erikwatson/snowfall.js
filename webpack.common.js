const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: { name: 'snowfall', type: 'umd' },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
