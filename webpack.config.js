import path from 'path'

const rules = []

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' }
  ]
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
  module: { rules }
}

export default [config]
