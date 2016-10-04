// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// @remove-on-eject-end

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var paths = require('./paths');
var config = require('./webpack.config.prod');

module.exports = Object.assign(config, {
  output: Object.assign(config.output, {
    path: paths.appStaging,
  }),
  plugins: [new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml
  })].concat(config.plugins.filter(plugin =>
    !(plugin instanceof webpack.optimize.UglifyJsPlugin) &&
    !(plugin instanceof HtmlWebpackPlugin)
  ))
});
