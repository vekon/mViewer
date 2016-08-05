var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname + '/build');
var APP_DIR = path.resolve(__dirname + '/src');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});



var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'site.js',
        libraryTarget: 'umd'
    },
    devServer: {
    inline:true,
    port: 3000
  },


    module: {
        loaders: [{
                test: /\.jsx?/,
                include: APP_DIR,
                loaders: ['react-hot', 'babel', 'babel-loader']
            },

     {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
        include: APP_DIR

      },

        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        HTMLWebpackPluginConfig,
        new CopyWebpackPlugin([
            { from: APP_DIR + '/vendors/css/grid.css', to: BUILD_DIR  + '/grid.css'}
            ])

    ]

};

module.exports = config;
