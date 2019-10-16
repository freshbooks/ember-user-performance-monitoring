'use strict';
const fs = require('fs');

function readSnippet(fileName) {
  return fs.readFileSync(`${__dirname}/vendor/${fileName}`, 'utf8');
};

module.exports = {
  name: require('./package').name,

  contentFor(type, config) {
    const addonConfig = config['ember-user-performance-monitoring'] || {};

    const { enabled, observePaint, observeTTI } = addonConfig;

    if (type === 'head' && enabled) {
      let script = '<script>';
      script += readSnippet('observer.js');

      if (observePaint) {
        script += readSnippet('observe-paint.js');
      }

      if (observeTTI) {
        script += readSnippet('observe-tti.js');
      }

      script += '</script>';

      return script;
    }
  }
};