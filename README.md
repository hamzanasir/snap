# Snap

Snap is a framework to simplify the implementation of cross-cutting concerns in services.    It includes/could-include support for logging, statistics, discovery, configuration, failover, monitoring in a simple way and mostly as a very light wrapper of popular node.js libraries.

Snap is inspired by Finagle and ideally should expose and impose a Promises based API.

FAQ
- Why a Framework like this? Because otherwise when you have 10 services running in your organization it is impossible to ensure that the logging format is the same, the health endpoints are the same, the configuration format is the same... and that ends up wasting a huge amount of money in any organization.
- Why is a single module instead of multiple modules?   I tried splitting it in different modules but one of the advantages of Snap is to use it as a framework and not independent modules.   Also is the way it is done in Finagle and we could change later if needed.

## Stats Module
Stats module mantains a dictionary of statistics that can be populated and consumed from different modules.   

The most common use case is to be populated automatically when using other modules (like http-client) and be consumed by exposing the information in a http server health endpoint.

## Logging Module
Very thing wrapper of log4js but ensuring all the logs follow the format:
```
Action: key: value, key: value, key: value
```

In most of the cases the logs will be generated automatically when using other modules (like http-client) but the module can also be used to generate consistent application level logs when needed. Example of use:
```
var logging = require('snap-framework').Logging;
var logger = logging.getLogger();
logger.info(logging.format('ServerStart', { host: host, port: port }));
```


## Http Client Module
Very thin wrapper on the standard request module for node.js that includes logging and statistics and should include discovery, load balancing and failover in the future.
The wrapper doesn't change the request module API:

```
var http = require('snap-framework').HttpClient;
var request = http('google');
request('http://www.google.com', function() {
});
```

## Http Server Module
Express filter that generates stats and logs for incoming requests.

```
var http = require('snap-framework').HttpServer;
var app = express();
app.use(http.filter('hello-world'));
```

# Hello World

This is the hello world including the usage of stats, logging and http server module.

This HTTP server generates stats and logs for all the http requests received in a consistent format.   It also logs manually some events (server startup) in the same format.

```
var express = require('express');
var config = require('config');
var log4js = require('log4js');
var logging = require('snap-framework').Logging;
var stats = require('snap-framework').Stats;
var http = require('snap-framework').HttpServer;

log4js.configure({ appenders: config.appenders });
var logger = logging.getLogger();

var app = express();
app.use(http.filter('hello-world'));

app.get ('/server/health', function(req, res) {
  res.send({
    stats: stats.stats()
  });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  logger.info(logging.format('ServerStart', { host: host, port: port }));
});
```
