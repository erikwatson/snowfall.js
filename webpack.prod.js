const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'index.min.js' // ← final public filename
  },
  optimization: {
    minimize: true // Terser runs automatically
  }
})
