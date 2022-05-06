const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/watermark/index.js',
  output: {
    filename: 'watermark.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'watermark',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './../index.html')
    }),
    new BundleAnalyzerPlugin(
      {
        reportFilename: 'report-component.html',
        analyzerMode: 'static' // 使用静态打开的方式
      }
    )
  ]
}