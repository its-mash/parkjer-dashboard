const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
} );

module.exports = {
  mode:"development",
  entry: {
    'main': './angular/scripts/main.js',
    'controllers/chart':'./angular/scripts/controllers/chart.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'angular/wscripts'),

  },
  module: {
    rules: [
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/preset-env']
                }
            }
        }
    ]
  },
  optimization: {
      minimize: false
  },
  watch: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': dotenv.parsed
    })
  ]

}