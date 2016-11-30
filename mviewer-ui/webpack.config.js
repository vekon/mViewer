const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

const BUILD_DIR = path.resolve(__dirname + '/build');
const APP_DIR = path.resolve(__dirname + '/src');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});

const npmEvent = process.env.npm_lifecycle_event;
let ENV;
if (npmEvent == 'start') {
  ENV =  'development';
}

const config = {
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
          },{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
            include: APP_DIR
          },{
            test: /\.json$/, loader: 'json-loader'
          },{
            test: /\.(otf|woff|woff2|eot|ttf|svg)$/,
            exclude: /node_modules/,
            loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
          }
        ]
    },

    plugins: [
        new DefinePlugin({
          'ENV': JSON.stringify(ENV)
        }),
        new ExtractTextPlugin('styles.css'),
        HTMLWebpackPluginConfig,
        new CopyWebpackPlugin([
            { from: APP_DIR + '/vendors/css/grid.css', to: BUILD_DIR  + '/grid.css'}
        ]),
        new CopyWebpackPlugin([
            { from: APP_DIR + '/assets', to: BUILD_DIR  + '/'}
        ])
    ]
};

module.exports = config;
