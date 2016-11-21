const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'client'),
  entry: [
    // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './app.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public/build'),
    publicPath: "/build/",
    filename: "bundle.js"
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'}
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devServer: {
    inline: true,
    noInfo: false,
    contentBase: 'public',
    historyApiFallback: '/',
    index: '/',
    publicPath: '/build/',
    stats: {
      chunks: false,
      colors: true
    }
  }
};