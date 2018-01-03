var $exports = {
 "Auth": "auth.js",
 "Client": "client.js",
 "helper": {
  "Replacer": "helper/replacer.js"
 },
 "Spec": "spec.js"
};
const distDir = 'dist';
function include(file, name) {
  const pkg = require('./' + distDir + '/' + file);
  return name === undefined ? pkg.default : pkg[name];
}

var exports = function ($exports) {
  Object.keys($exports).forEach(function (name) {
    if (typeof $exports[name] === 'object') {
      exports($exports[name])
    } else {
      $exports[name] = include($exports[name])
    }
  });
};
exports($exports);

module.exports = $exports;