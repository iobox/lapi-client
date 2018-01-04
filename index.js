let $module = {
 "Auth": "auth.js",
 "Client": "client.js",
 "helper": {
  "Replacer": "helper/replacer.js"
 },
 "Spec": "spec.js"
};
const publish = function ($object) {
  Object.keys($object).forEach(function($key) {
    if (typeof $object[$key] === 'string') {
      $object[$key] = require('./dist/' + $object[$key]);
    } else if (typeof $object[$key] === 'object') {
      $object[$key] = publish($object[$key])
    }
  });
  
  return $object;
};
module.exports = publish($module);