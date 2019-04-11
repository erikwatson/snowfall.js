import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/snowfall.js',
  output: {
    file: './dist/snowfall.js',
    format: 'iife',
    name: 'snowfall'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
