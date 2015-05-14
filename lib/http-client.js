var request = require('request'),
    stats = require('./stats.js'),
    logging = require('./logging.js');

var ACTION = 'HttpRequest';

module.exports = function(settings) {
  var name = typeof settings == 'object' ? settings.name : settings,
      loggingEnabled = settings.logging === false ? false : true,
      statsEnabled = settings.stats === false ? false : true;
      
  var fn = function() {
	  request.apply(this, arguments);
  };
  if (statsEnabled) fn = stats.track(name, fn);
  if (loggingEnabled) fn = logging.track(name, ACTION, fn);
  
  return fn;
};
