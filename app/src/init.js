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

var map = require('src/map');

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

$(function () {
  //set world stage
  var viewport = new createjs.Stage('world');
  var mm = new map(mapG, tileTypes, viewport);

  var player = (function () {
    var entity = new createjs.Container();

    var circle = new createjs.Shape();
    circle.graphics.beginFill('DeepSkyBlue').drawRect(0, 0, 25, 25);
    var circlee = new createjs.Shape();
    circlee.graphics.beginFill('red').drawCircle(12.5, 12.5, 5);

    entity.addChild(circle);
    entity.addChild(circlee);
    entity.x = 400;
    entity.y = 300;

    entity.worldX = 0;
    entity.worldY = 0;
    return entity;
  })();

  console.log(player);


  player.addEventListener('click', function (evt) {
    console.log(evt);
  });

  viewport.addEventListener('stagemousedown', function (evt) {

    var current = {
      x: player.worldX,
      y: player.worldY,
    };
    var x = player.worldX + ((evt.stageX - 12) - 400);
    x = Math.round(x / 25) * 25;

    var y = player.worldY + ((evt.stageY - 12) - 300);
    y = Math.round(y / 25) * 25;

    mm.path(current, {
      x: Math.min(Math.max(x, 0), mm.maxX),
      y: Math.min(Math.max(y, 0), mm.maxY)
    }, function (path) {
      console.log(path);

      _.forEach(path, function (p, i) {
        setTimeout(function () {
          mm.set(p.x, p.y);
          player.worldX = p.x;
          player.worldY = p.y;
        }, i * 100);
      });

    });

    //    mm.set(player.worldX, player.worldY);

    console.log('Player Pos:', player.worldX, player.worldY);
  });


  viewport.addChild(mm.view);
  viewport.addChild(player);
  mm.set(player.worldX, player.worldY);


  function handleTick() {
    viewport.addChild(player);
    viewport.update();
  }

  createjs.Ticker.setFPS(30);
  //  createjs.Ticker.addEventListener('tick', handleTick);

});
