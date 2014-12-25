var Promise = require('bluebird')
  , redisModel = require('./redis_model')
  , getJobs = require('./get_jobs')(redisModel)

module.exports = function (config) {
  var router = config.router;
  var redisClient = config.redisClient;
  if (!router) throw new Error("Config must provide an express Router at key 'router'");
  if (!redisClient) throw new Error("Config must provide a redis client at key 'redisClient'");

  redisModel.setClient(redisClient)

  var states = [ 'active', 'wait', 'failed', 'complete' ]

  states.forEach(function(state) {
    router.route('/'+state)
    .get(function (req, res, next) {
      getJobs(state).then(function(data){
        res.json(data);
      }).error(next).catch(next)
    })
  })

  router.route('/pending/id/:type/:id')
  .get(function (req, res, next) {
    var id = req.params.id
      , type = req.params.type
    redisModel.makePendingById(type, id).then(function(results){
      res.json(results);
    }).error(next).catch(next)
  });


  router.route('/delete/id/:type/:id')
  .get(function (req, res, next) {
    var id = req.params.id
      , type = req.params.type
    redisModel.deleteJobById(type, id).then(function(results){
      res.json(results);
    }).error(next).catch(next)
  });

  if(config.server) {
    var SSE = require('sse');
    var sse = new SSE(config.server);

    sse.on('connection', function(client) {
      var writer = setInterval(function () {
        states.forEach(function (state) {
          getJobs(state).then(function (jobs) {
            if (writer) { // reset to null on close to avoid writing after close
              client.send(state, JSON.stringify(jobs));
            }
          }).error(close).catch(close);
        });
      }, 1000);

      function close() {
        client.close();
      }

      client.on('close', function () {
        clearTimeout(writer);
        writer = null;
      });
    });
  }

  return router;
};
