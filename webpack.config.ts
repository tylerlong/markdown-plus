import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'development',
  target: 'web',
  entry: {
    index: './src/index.ts',
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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
    extensions: ['.ts', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
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

// workaround a TS compile issue: devServer is not in the webpack types
config['devServer'] = {
  static: {
    directory: path.join(__dirname, 'docs'), // Directory to serve static files from
  },
};

export default config;
