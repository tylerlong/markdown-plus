import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'development',
  target: 'web',
  entry: {
    index: './src/index.js',
  },
  externals: 'fs', // in order to make mermaid work
  output: {
    path: path.join(__dirname, './docs/'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              'transform-remove-strict-mode', // in order to make mermaid work
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
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
        // omit generating a separate license file when building for production
        extractComments: false,
      }),
    ],
  },
};

export default config;
