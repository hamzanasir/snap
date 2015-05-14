var stats = require('./stats.js'),
    logging = require('./logging.js'),
    uuid = require('uuid');
    
var ACTION = 'HttpServer';

exports.filter = function(settings) {
  var name = typeof settings == 'object' ? settings.name : settings,
      loggingEnabled = settings.logging === false ? false : true,
      statsEnabled = settings.stats === false ? false : true;
  
  var logger = logging.getLogger(name),
      id = uuid.v4();
  
  // TODO(ggb): Log parentId coming from clients to create a hierarchy of logs for
  // tracking/debugging pourpuses
  
  return function(req, res, next) {
    var begin;
    if (loggingEnabled) logger.info(logging.format(ACTION + 'Begin', { id: id, url: req.url }));
    if (statsEnabled) begin = new Date().getTime();
    
    res.on('finish', function() {
      if (loggingEnabled) logger.info(logging.format(ACTION + 'Begin', { id: id, status: res.statusCode }));
      if (statsEnabled) stats.record(name, 'finish', new Date().getTime() - begin);
    });
    next();
  };
};
