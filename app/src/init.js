// map gen
var mapG = (function () {
  var map = [];
  var xCount = 0;
  var yCount = 0;
  var row = [];
  while (xCount < 100) {
    xCount++;
    yCount = 0;
    row = [];
    while (yCount < 80) {
      row.push((_.random(1, 4) == 1 ? 1 : 0));
      yCount++;
    }
    map.push(row);
  }

  return map;
})();


var tileTypes = {
  0: (function () {
    var t = new createjs.Shape();
    t.graphics.beginFill('#D8D8D8').drawRect(0, 0, 32, 32);
    return t;
  })(),
  1: (function () {
    var t = new createjs.Shape();
    t.graphics.beginFill('#E8DEDE').drawRect(0, 0, 32, 32);
    return t;
  })(),
};

var world = require('src/world');

$(function () {
  //set world stage
  var $fps = $('#fps');
  var stage = new createjs.Stage('world');

  var $world = new world(mapG, tileTypes, stage);

  var playerObj = {
    image: '/images/character.png',
  };

  $world.addPlayer(playerObj, 10, 10);

  function handleTick(event) {
    $fps.text(createjs.Ticker.getMeasuredFPS() || 0);
    $world.onTick(event);
    stage.update(event);
  }

  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener('tick', handleTick);

});
