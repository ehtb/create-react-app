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

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'staging';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});

var chalk = require('chalk');
var fs = require('fs-extra');
var rimrafSync = require('rimraf').sync;
var webpack = require('webpack');
var config = require('../config/webpack.config.staging');
var paths = require('../config/paths');
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
var recursive = require('recursive-readdir');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

recursive(paths.appStaging, (err, fileNames) => {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  rimrafSync(paths.appStaging + '/*');

  // Start the webpack build
  build();

  // Merge with the public folder
  copyPublicFolder();
});


// Create the staging build and print the deployment instructions.
function build() {
  console.log('Creating a staging build...');
  webpack(config).run((err, stats) => {
    if (err) {
      console.error('Failed to create a staging build. Reason:');
      console.error(err.message || err);
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

    var openCommand = process.platform === 'win32' ? 'start' : 'open';
    var homepagePath = require(paths.appPackageJson).homepage;
    var publicPath = config.output.publicPath;
    if (publicPath !== '/') {
      // "homepage": "http://mywebsite.com/project"
      console.log('The project was built assuming it is hosted at ' + chalk.green(publicPath) + '.');
      console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
      console.log();
      console.log('The ' + chalk.cyan('staging') + ' folder is ready to be deployed.');
      console.log();
    } else {
      // no homepage or "homepage": "http://mywebsite.com"
      console.log('The project was built assuming it is hosted at the server root.');
      if (homepagePath) {
        // "homepage": "http://mywebsite.com"
        console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
        console.log();
      }
      console.log('The ' + chalk.cyan('staging') + ' folder is ready to be deployed.');
      console.log('You may also serve it locally with a static server:')
      console.log();
      console.log('  ' + chalk.cyan('npm') +  ' install -g pushstate-server');
      console.log('  ' + chalk.cyan('pushstate-server') + ' staging');
      console.log('  ' + chalk.cyan(openCommand) + ' http://localhost:9000');
      console.log();
    }
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appStaging, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}
