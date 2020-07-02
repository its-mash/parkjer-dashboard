const path = require('path');


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
  watch: true

}