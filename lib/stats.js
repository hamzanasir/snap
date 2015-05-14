var MA = require('moving-average');

var timeInterval = 5 * 60 * 1000; // 5 minutes

var STATS = { };

function stats() {
  return STATS;
}

function record(name, variation, delay) {
  STATS[name] = STATS[name] || { count: 0, delay: MA(timeInterval) };
  STATS[name].count ++;
  STATS[name].delay.push(Date.now(), delay);
  STATS[name][variation] = (STATS[name][variation] || 0) + 1;
}

function track(name, fn) {
  return function() {
    var begin = new Date().getTime();
    
    var callback = arguments[arguments.length - 1];
    arguments[arguments.length - 1] = function(err) {
    
      var end = new Date().getTime();
      
      record(name, err ? 'failure' : 'success', end - begin);
      
      callback.apply(this, arguments);
    };
    fn.apply(this, arguments);
  }; 
}

exports.stats = stats;
exports.record = record;
exports.track = track;
