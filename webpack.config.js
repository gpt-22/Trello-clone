const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const getFilename = (ext) => isProd ? `bundle.${ext}` : `bundle.[hash].${ext}`
const getJSLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    },
  ]
  if (!isProd) loaders.push('eslint-loader')
  return loaders
}

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  mode: isProd ? 'production' : 'development',
  entry: ['@babel/polyfill', './js/app.js'],
  output: {
    filename: getFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: !isProd ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: !isProd,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/img/list-settings.png'),
          to: path.resolve(__dirname, 'dist/img'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: getFilename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: getJSLoaders(),
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
}
