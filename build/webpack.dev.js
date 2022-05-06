const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'watermark.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs2'
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    hot: true,
    static: 'dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './../index.html')
    }),
    new webpack.HotModuleReplacementPlugin() // 实现热更新
  ]
}