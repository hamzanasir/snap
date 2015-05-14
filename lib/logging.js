var log4js = require('log4js'),
    assert = require('assert'); 

function track(name, action, fn) {
  var logger = log4js.getLogger(name);
  return function() {
    logger.info(name, action + 'Begin', {});
    
    var callback = arguments[arguments.length - 1];
    
    assert(typeof(callback) === 'function');
    
    arguments[arguments.length - 1] = function(err) {
      logger.info(name, action + 'End', {});
      
      callback.apply(this, arguments);
    };
    fn.apply(this, arguments);
  }; 
}

exports.getLogger = log4js.getLogger;
exports.track = track;
