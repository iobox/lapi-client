var jzKndBoOHoOWyYRw = {
 "Auth": "auth.js",
 "Client": "client.js",
 "helper": {
  "Replacer": "helper/replacer.js"
 },
 "Spec": "spec.js"
};
var publish = function ($object) {
  Object.keys($object).forEach(function($key) {
    if (typeof $object[$key] === 'string') {
      var pkg = require('./dist/' + $object[$key]);
      $object[$key] = typeof pkg.default !== 'undefined' ? pkg.default : pkg;
    } else if (typeof $object[$key] === 'object') {
      $object[$key] = publish($object[$key])
    }
  });
  
  return $object;
};
module.exports = publish(jzKndBoOHoOWyYRw);