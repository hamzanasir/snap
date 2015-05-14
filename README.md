# Snap

Snap is a framework to simplify the implementation of cross-cutting concerns in services.    It includes/could-include support for logging, statistics, discovery, configuration in a simple way and mostly as a very light wrapper of popular node.js libraries.

Snap is inspired by Finagle and ideally should expose a Promises based API.

FAQ
- Why a Framework like this? Because otherwise when you have 10 services running in your organization it is impossible to ensure that the logging format is the same, the health endpoints are the same, the configuration format is the same... and that ends up wasting a huge amount of mony in any organization.
- Why is a single module instead of multiple modules?   I tried splitting it in different modules but one of the advantages of Snap is to use it as a framework and not independent modules.   Also is the way it is in Finagle and could change later.

## Stats Module
Stats module mantains a dictionary of statistics that can be populated and consumed from different modules.   The most common use case is to be populated automatically when using other modules (like http-client) and be consumed by exposing the information in a http server health endpoint.

## Logging Module
Very thing wrapper of log4js but ensuring all the logs follow the format:
```
Action: key: value, key: value, key: value
```
## Http Client Module
Very thin wrapper on the standard request module for node.js that includes logging and statistics and should include discovery, load balancing and failover in the future.
The wrapper doesn't change the request module API:

```
    var http = require('../lib/http-client.js');
    var request = http('google');
    request('http://www.google.com', function() {
    });
  });
```
