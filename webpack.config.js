import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const rules = [
  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
              targets: {
                browsers: ['last 2 versions'],
              },
            },
          ],
        ],
        plugins: [
          'transform-remove-strict-mode', // in order to make mermaid work
        ],
      },
    },
  },
];

const config = {
  mode: 'development',
  target: 'web',
  entry: {
    index: './src/index.js',
  },
  externals: 'fs', // in order to make mermaid work
  output: {
    path: path.join(__dirname, './docs/'),
    filename: '[name].bundle.js',
  },
  module: { rules },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      scriptLoading: 'blocking',
    }),
  ],
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'), // Directory to serve static files from
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false, // omit license file when build for prod
      }),
    ],
  },
};

export default [config];
