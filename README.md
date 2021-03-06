express-bull
============

Express 4 router containing an API for bull job queue, based heavily on [Matador](https://github.com/ShaneK/Matador). It uses less libraries and uses bluebird instead of Q as the promise library.

Designed for consumption by [react-bull](https://github.com/keyvanfatehi/react-bull)

### Usage

`npm install --save express-bull`

```js
var redis = require('redis');
var express = require('express');
var expressBull = require('express-bull');

var app = express();
var server = require('http').Server(app);

app.use('/jobs', expressBull({
  router: express.Router(),
  server: server,
  redisClient: redis.createClient()
}))

server.listen(1337)
```

```
$ curl http://localhost:1337/jobs/active
{"keys":[],"counts":{"active":0,"complete":0,"failed":0,"pending":0,"total":0,"stuck":0}}
```

Using [Server-Sent Events](http://www.w3.org/TR/eventsource/):
```
$ curl http://localhost:1337/sse
{"keys":[],"counts":{"active":0,"complete":0,"failed":0,"pending":0,"total":0,"stuck":0}}
```
