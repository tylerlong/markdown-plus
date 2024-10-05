import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const rules = [
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  },
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            'env',
            {
              'targets': {
                'browsers': ['last 2 versions']
              }
            }
          ]
        ],
        plugins: [
          'transform-remove-strict-mode' // in order to make mermaid work
        ]
      }
    }
  }
]

const config = {
  target: 'web',
  entry: {
    'index': './src/index.js'
  },
  externals: 'fs', // in order to make mermaid work
  output: {
    path: path.join(__dirname, './docs/'),
    filename: '[name].bundle.js'
  },
  module: { rules },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css')
  ]
}

export default [config]
