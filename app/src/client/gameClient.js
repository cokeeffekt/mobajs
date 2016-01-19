var pin = localStorage.getItem('_pin');
var username = localStorage.getItem('_username') || 'player' + _.random(0, 999);
var peerPubSub = require('src/peerPubSub');

var world = require('src/client/world');
var map = require('src/client/map');

$(document.body).html(require('tpls/gameloading.tpl'));
var mapData;

var pubsub = new peerPubSub.join(pin, username);

pubsub.on('connect', function () {
  console.log('im connected to server!');
});

pubsub.on('disconnect', function () {
  console.log('disconnected');
  alert('Server gone :|');
  location.href = '/';
});

pubsub.on('error', function () {
  console.log('error conecting');
  alert('Error finding game');
  location.href = '/';
});

pubsub.on('gameInfo', function (data) {
  console.log(data);
  pubsub.emit('fetchmap', data.mapId);
});

pubsub.on('mapdata', function (data, event) {
  mapData = JSON.parse(data);
  map.build(mapData);
});

map.ready(function (mapObj, heroObj, npcObj) {
  $(document.body).append(require('tpls/game.tpl'));

  var $gameCont = $('#container');
  var $stats = $gameCont.find('.stats');
  $stats.fps = $('<span data-value="0">FPS : </span>').appendTo($stats);
  console.log($stats);

  var $gameCanvas = $('<canvas id="world" width="' + window.innerWidth + '" height="' + window.innerHeight + '"></canvas>');
  $gameCont.append($gameCanvas);

  console.log('Map Ready');
  $('#loader').hide();

  // tell server its loaded the world ok

  pubsub.emit('world-loaded');

  var $fps = $('#fps');
  var stage = new createjs.Stage('world');
  stage.snapToPixelEnabled = true;

  var $world = new world(mapObj, stage);

  console.log(heroObj);

  function handleTick(event) {
    $stats.fps.attr('data-value', (createjs.Ticker.getMeasuredFPS()).toFixed(2) || 0);
    $world.onTick(event);
    stage.update(event);
  }

  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener('tick', handleTick);


  //  $world.addPlayer(heroObj['naked-man'], 18, 46);

  // wave 1 test

  //  var count = 1;
  //  while (count < 20) {
  //    count++;
  //    setTimeout(function () {
  //      var firstnpc = $world.addNpc(npcObj['white-dragon'], 5, 3);
  //      setTimeout(function () {
  //        firstnpc.walkTo(18, 47);
  //      }, 500);
  //    }, 3000 * count);
  //  }

  function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
    $gameCanvas.attr('width', window.innerWidth);
    $gameCanvas.attr('height', window.innerHeight);
  }
  window.addEventListener('resize', resize, false);


  // game related events
  pubsub.on('choose-hero', function () {
    console.log('choose hero ploz');
    console.log(heroObj);
  });

});
