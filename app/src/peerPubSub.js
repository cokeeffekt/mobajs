var peerJsKey = 'ngp8uf0sfackgldi';
var debug = 3;

function host(pin, options) {
  var connectionList = [];
  var subscriptions = [];
  var peer = new Peer('mobajs_' + pin, {
    key: peerJsKey,
    debug: debug
  });

  peer.on('open', function (id) {
    console.log('Server Running on : ' + id);
    runSub('ready', pin);
  });

  // when a client connects

  var dataConnections = [];

  peer.on('connection', function (dataCon) {
    dataCon.username = dataCon.metadata.username;
    dataConnections.push(dataCon);
    dataCon.on('data', function (msg) {
      if (typeof msg == 'object') {
        if (msg.emit)
          runSub(msg.emit, msg.data || null, dataCon.metadata.username);
      }
    });
    dataCon.on('close', function () {
      runSub('disconnect', dataCon.metadata.username);
      _.remove(dataConnections, {
        username: dataCon.metadata.username
      });
    });
    // wait 2 seconds in case of close
    dataCon.on('open', function () {
      runSub('connect', dataCon.metadata.username);
    });
  });

  peer.on('error', function () {
    runSub('error', arguments);
  });

  // host needs to leave the tab open
  window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
      var confirmationMessage = 'This will kill the server that is running.';
      (e || window.event).returnValue = confirmationMessage;
      if (!confirmationMessage)
        peer.destroy();
      return confirmationMessage;
    }
  };

  // subscription handling

  function runSub(event, data, username) {
    _.where(subscriptions, {
      event: event
    }).map(function (sub) {
      sub.function(data, event, username);
    });
  }

  this.subscribe = function (event, fn) {
    subscriptions.push({
      event: event,
      function: fn
    });
  };

  this.emit = function (event, data, to) {
    if (to) {
      var sendto = _.find(dataConnections, {
        username: to
      });
      if (sendto) {
        sendto.send({
          emit: event,
          data: data
        });
        //        if (debug === 3)
        //          console.log('hostemit : ' + event + ' : ' + to);
      }

    } else {
      _.forEach(dataConnections, function (dataCon) {
        dataCon.send({
          emit: event,
          data: data
        });
      });
    }

  };
}

function join(pin, username) {
  var subscriptions = [];

  var peer = new Peer({
    key: peerJsKey,
    debug: debug
  });
  var dataCon = false;
  peer.on('open', function (id) {
    console.log('Client Running at : ' + id);

    // connect to the server
    dataCon = peer.connect('mobajs_' + pin, {
      label: 'chat',
      serialization: 'json',
      metadata: {
        username: username
      }
    });
    dataCon.on('open', function () {
      console.log('Connection open to : ' + 'mobajs_' + pin);
      runSub('connect');
    });

    var chunked = {};
    dataCon.on('data', function (msg) {
      if (typeof msg == 'object') {

        if (msg.emit.match(/\:chunked$/)) {
          if (!chunked[msg.data[1]])
            chunked[msg.data[1]] = [];
          chunked[msg.data[1]].push(msg.data[2]);

          if (msg.data[0] === msg.data[1]) {
            runSub(msg.emit.replace(/\:chunked$/, ''), chunked[msg.data[1]].join(''));
            chunked[msg.data[1]] = undefined;
            delete chunked[msg.data[1]];
          }
        }
        if (msg.emit)
          runSub(msg.emit, msg.data || null);
      }
    });
    dataCon.on('error', function (err) {
      alert(err);
    });

    var handleClose = function () {
      console.log('Connection to server lost');
      peer.destroy();
      runSub('disconnect', null);
    };

    dataCon.on('disconnected', handleClose);
    dataCon.on('close', handleClose);

  });

  peer.on('error', function () {
    runSub('error', arguments);
  });

  window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
      peer.destroy();
    }
  };

  function runSub(event, data) {
    _.where(subscriptions, {
      event: event
    }).map(function (sub) {
      sub.function(data || null, event);
    });
  }

  this.subscribe = function (event, fn) {
    subscriptions.push({
      event: event,
      function: fn
    });
  };

  this.emit = function (event, data) {
    if (dataCon) {
      dataCon.send({
        emit: event,
        data: data
      });
    }
  };
}

host.prototype.emit = function (event, data, to) {
  if (event)
    this.emit(event, data || null, to || null);
};

host.prototype.chunk = function (event, data, to) {
  var self = this;
  if (!event) return;

  var chunks = _.chunk(data, 256);
  _.forEach(chunks, function (c, i) {
    self.emit(event + ':chunked', [i + 1, chunks.length, c.join('')], to || null);
  }, this);

};

join.prototype.emit = function (event, data) {
  if (event)
    this.emit(event, data || null);
};

host.prototype.on = function (event, fn) {
  if (typeof fn == 'function')
    this.subscribe(event, fn);
};
join.prototype.on = function (event, fn) {
  if (typeof fn == 'function')
    this.subscribe(event, fn);
};

module.exports = {
  host: host,
  join: join
};
