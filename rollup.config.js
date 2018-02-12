import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/snowfall.js',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'ErikTest'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
