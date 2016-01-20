var peerPubSub = require('src/peerPubSub');

var $view = $(require('tpls/server.tpl'));
var $leftBar = $view.find('.leftbar');
var $console = $view.find('.console');

$(document.body).html($view);

// take over the console log for reporting
consoleEvents(function (type, msg) {
  _.forEach(msg, function (e) {
    $console.append('<div class="' + type + '"><b>' + type.toUpperCase() + ' : </b>' + e);
    $console.scrollTop($console[0].scrollHeight);
  });
});

var $mapLoad = require('src/server/mapload');

$leftBar.html($mapLoad);


// once we have a map file.
$mapLoad.on('maploaded', function (event, mapData) {
  var index = _.find(mapData.files, {
    path: 'index.json'
  });

  var mapInfo = JSON.parse(index.contents);

  var $mapInfo = $('<div>');
  $mapInfo.append('<h2>' + mapInfo.title + '</h2>');

  $mapInfo.append('<pre>' +
    '<b>Max Players</b> : ' + mapInfo.maxPlayers +
    '</pre>');

  $mapInfo.append('<button data-start-game>Start Game</button>');

  $mapInfo.on('click', '[data-start-game]', function () {
    server(mapData, '0000');
  });
  $leftBar.html($mapInfo);
});


function server(mapData, pin) {
  var stats = {
    pin: pin,
    title: 'Loading',
    status: 'waiting',
    maxPlayers: 0,
    connected: [],
    joinlink: location.origin + '/#!/game/' + pin
  };

  // set up a view for displaying stats
  var $gameLeft = jqv.new(require('tpls/gamestats.tpl'), stats);
  $leftBar.html($gameLeft);

  // initially load the mapinfo and mapfile
  console.log(mapData);
  var index = _.find(mapData.files, {
    path: 'index.json'
  });
  var mapInfo = JSON.parse(index.contents);

  stats.title = mapInfo.title;
  $gameLeft.draw();

  var mapFile = JSON.parse(_.find(mapData.files, {
    path: mapInfo.mapFile
  }).contents);

  // we only want the collisions layer since we are the server and dont care for much else.
  var collisionLayer = _.clone(_.find(mapFile.layers, {
    name: 'collisions'
  }));
  collisionLayer.grid = _.chunk(b642array(collisionLayer.data), collisionLayer.width);

  // start listening for peers
  var pubsub = new peerPubSub.host(pin, {});

  pubsub.on('ready', function () {
    stats.status = 'running';
    $gameLeft.draw();
  });

  pubsub.on('error', function () {
    console.log('Server Dead?');
  });

  pubsub.on('connect', function (username, event) {

    if (_.contains(stats.connected, username)) {
      return pubsub.emit('kick', 'Username already connected');
    }

    stats.connected.push(username);
    console.log('player joined : ' + username);
    $gameLeft.draw();

    // tell the player about the game
    console.log('sending initial map info to ' + username);
    pubsub.emit('gameInfo', {
      title: stats.title,
      mapId: mapData.mapId
    }, username);
  });

  pubsub.on('disconnect', function (username, event) {
    console.log('player disconnected : ' + username);
    _.pull(stats.connected, username);
    $gameLeft.draw();
  });

  pubsub.on('fetchmap', function (mapId, event, from) {
    console.log('sending map data to ' + from);
    pubsub.chunk('mapdata', localStorage.getItem('_map_data_' + mapId), from);
  });

  pubsub.on('ping', function (n, e, from) {
    pubsub.emit('pong', 0, from);
  });


  var heroes = [];
  // world loaded get hero info
  pubsub.on('world-loaded', function (n, event, from) {
    console.log(from + ' loaded world ok!');
    var hero = _.find(heroes, {
      username: from
    });
    if (!hero) {
      pubsub.emit('choose-hero', null, from);
    } else {
      _.forEach(heroes, function (hero) {
        pubsub.emit('new-hero', hero, from);
      });
    }
  });

  // hero stuff
  pubsub.on('select-hero', function (slug, event, from) {
    // check hero slug exists
    var findHero = _.find(mapInfo.heroes, {
      slug: slug
    });
    if (findHero) {
      console.log(from + ' has selected a hero : ' + slug);
      var hero = _.clone(findHero);
      hero.username = from;
      heroes.push(hero);
      pubsub.emit('new-hero', hero);
    } else {
      pubsub.emit('choose-hero', null, from);
    }
  });

  // hero move
  pubsub.on('player-move', function (obj, event, from) {
    var hero = _.find(heroes, {
      username: from
    });
    if (hero) {
      _.assign(hero, obj);
      console.log(from + ' has moved to ' + obj.tileX + ',' + obj.tileY);
      pubsub.emit('player-move:' + from, obj);
    }

  });

}
