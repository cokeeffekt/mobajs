var world = require('src/world');
var map = require('src/map');

$(function () {
  map.ready(function (mapObj, heroObj) {
    console.log('Map Ready');
    $('#loader').hide();

    var $fps = $('#fps');
    var stage = new createjs.Stage('world');

    var $world = new world(mapObj, stage);

    console.log(heroObj);

    function handleTick(event) {
      $fps.text('FPS   :   ' + (createjs.Ticker.getMeasuredFPS()).toFixed(2) || 0);
      $world.onTick(event);
      stage.update(event);
    }

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', handleTick);

    $world.addPlayer(heroObj['naked-man'], 5, 5);

  });

  map.build('/maps/enfos/');
});
