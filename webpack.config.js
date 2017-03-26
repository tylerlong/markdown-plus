import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const rules = []

rules.push({
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader'
  })
})

rules.push({
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
})

rules.push({
  test: /\.(ttf|eot|svg|woff2?)(\?v=.+?)?$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  }
})

const config = {
  target: 'web',
  entry: {
    'index': './src/index.js'
  },
  output: {
    path: path.join(__dirname, './dist/fonts/'),
    publicPath: 'fonts/',
    filename: '../[name].bundle.js'
  },
  module: { rules },
  plugins: [
    new ExtractTextPlugin('../[name].bundle.css')
  ]
}

export default [config]
