var redis = require('redis');
var express = require('express');
var expressBull = require('./');

var app = express();
var server = require('http').Server(app);

app.use('/jobs', expressBull({
  router: express.Router(),
  redisClient: redis.createClient(),
  server: server
}))

server.listen(1337)
