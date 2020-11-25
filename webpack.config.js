const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // 先设置为development，不压缩代码，方便调试
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
        options: {
          value: 'iwen' //参数传入到loader里面，方便getOptions接收到
        } 
      }
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  }
}