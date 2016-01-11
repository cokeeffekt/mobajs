function map(mapG, tileTypes, stage) {


  // path finding
  var easystar = new EasyStar.js();
  easystar.setGrid(mapG);
  easystar.setAcceptableTiles([0]);
  easystar.enableDiagonals();

  this.path = function (from, too, cb) {

    from.x = Math.round(from.x / 25);
    from.y = Math.round(from.y / 25);

    too.x = Math.round(too.x / 25);
    too.y = Math.round(too.y / 25);

    console.log(from, too);

    easystar.findPath(from.x, from.y, too.x, too.y, function (path) {
      if (path === null) {
        console.log('Path was not found.');
      } else {
        path.map(function (t) {
          t.x = t.x * 25;
          t.y = t.y * 25;
        });
        if (typeof cb == 'function')
          cb(path);
      }
    });
    easystar.calculate();
  };

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

}

module.exports = map;
