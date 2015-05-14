var log4js = require('log4js'),
    assert = require('assert'),
    uuid = require('uuid');

function format(action, params) {
  var str = '';
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
        if (str.length) str += ", ";
        str += key + ": " + params[key];
    }
  }
  
  return action + ": " + str;
}

function track(name, action, fn) {
  var logger = log4js.getLogger(name),
      id = uuid.v4();
  return function() {
    logger.info(format(action + 'Begin', { id: id }));
    
    var callback = arguments[arguments.length - 1];
    
    assert(typeof(callback) === 'function');
    
    arguments[arguments.length - 1] = function(err) {
      logger.info(format(action + 'End', { id: id }));
      
      callback.apply(this, arguments);
    };
    fn.apply(this, arguments);
  }; 
}

exports.getLogger = log4js.getLogger;
exports.track = track;
exports.format = format;
