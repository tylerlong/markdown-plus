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
          ['env', {
            'targets': {
              'browsers': ['last 2 versions']
            }
          }]
        ]
      }
    }
  },
  {
    test: /\.(ttf|eot|svg|woff2?)(\?v=.+?)?$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }
  }
]

const config = {
  target: 'web',
  entry: {
    'index': './src/index.js'
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: '[name].bundle.js'
  },
  module: { rules },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css')
  ]
}

export default [config]
