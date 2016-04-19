var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var envFlagPlugin = new webpack.DefinePlugin({
  BACKEND_HOST: JSON.stringify(process.env.BACKEND_HOST || 'http://localhost:8000'),
});

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve('./dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  devServer: {
    contentBase: "./dist",
    hot: true,
    port: 8080,
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&' +
            'localIdentName=[name]__[local]___[hash:base64:5]' +
            '!postcss-loader!sass-loader?sourceMap'
        ),
      },
      {
        test: /\.svg$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      }
    ],
  },

  postcss: [
    require('autoprefixer-core')
  ],

  resolve: {
    modulesDirectories: ['node_modules', 'src']
  },

  plugins: [
    envFlagPlugin,
    new ExtractTextPlugin('main.css', {allChunks: true})
  ]
};
