// map gen
var mapG = (function () {
  var map = [];
  var xCount = 0;
  var yCount = 0;
  var row = [];
  while (xCount < 50) {
    xCount++;
    yCount = 0;
    row = [];
    while (yCount < 50) {
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
    t.graphics.beginFill('Green').drawRect(0, 0, 25, 25);
    return t;
  })(),
  1: (function () {
    var t = new createjs.Shape();
    t.graphics.beginFill('Black').drawRect(0, 0, 25, 25);
    return t;
  })(),
};

var map = require('src/map');
//var player = require('src/player');

$(function () {
  //set world stage
  var viewport = new createjs.Stage('world');
  var mm = new map(mapG, tileTypes, viewport);

  viewport.addEventListener('stagemousedown', function (evt) {

    var x = mm.currentX + ((evt.stageX - 12) - 400);
    x = Math.round(x / 25) * 25;
    x = Math.min(Math.max(x, 0), mm.maxX);

    var y = mm.currentY + ((evt.stageY - 12) - 300);
    y = Math.round(y / 25) * 25;
    y = Math.min(Math.max(y, 0), mm.maxY);

    mm.set(x, y, 500);
  });

  viewport.addChild(mm.view);
  mm.set(0, 0);

  function handleTick() {
    viewport.update();
  }

  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener('tick', viewport);

});
