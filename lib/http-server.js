var stats = require('./stats.js'),
    logging = require('./logging.js'),
    uuid = require('uuid');

var ACTION = 'HttpServer';

exports.filter = function(settings) {
  var name = typeof settings == 'object' ? settings.name : settings,
      loggingEnabled = settings.logging === false ? false : true,
      statsEnabled = settings.stats === false ? false : true,
      blacklist = settings.blacklist;

  var logger = logging.getLogger(name);

  // TODO(ggb): Log parentId coming from clients to create a hierarchy of logs for
  // tracking/debugging pourpuses

  return function(req, res, next) {
    var id = uuid.v4();
    var begin;

    var url = req.url;
    if (blacklist && url.match(blacklist)) {
      return next();
    }

    if (loggingEnabled) logger.info(logging.format(ACTION + 'Begin', { id: id, url: url }));
    if (statsEnabled) begin = new Date().getTime();

    res.on('finish', function() {
      if (loggingEnabled) logger.info(logging.format(ACTION + 'End', { id: id, status: res.statusCode }));
      if (statsEnabled) stats.record(name, 'finish', new Date().getTime() - begin);
    });
    next();
  };
};
