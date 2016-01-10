function map(mapG, tileTypes, stage) {

  mapG[0][0] = 0;
  mapG[0][1] = 0;
  mapG[1][1] = 0;

  var self = this;
  this.view = new createjs.Container();

  var mapC = [];

  this.maxY = (mapG.length - 1) * 25;
  this.maxX = (mapG[0].length - 1) * 25;

  console.log(this.maxY);
  console.log(this.maxX);

  mapG.map(function (row, rowI) {
    row.map(function (col, colI) {
      mapC.push({
        x: colI,
        y: rowI,
        cX: colI * 25,
        cY: rowI * 25,
        tile: tileTypes[col].clone()
      });
    });
  });

  var plate = new createjs.Shape();
  plate.graphics.beginFill('Purple').drawRect(0, 0, this.maxY + 25, this.maxX + 25);

  var current = {
    x: 0,
    y: 0
  };


  this.set = function (x, y) {

    self.view.removeAllChildren();
    self.view.addChild(plate);

    var reduce = _.filter(mapC, function (i) {
      if (i.cX < (x + 400) && i.cY < (y + 300) && i.cX > (x - 400) && i.cY > (y - 300))
        return true;
      return false;
    });
    //    var reduce = mapC;

    reduce.map(function (tile) {
      self.view.addChild(tile.tile);
      tile.tile.x = tile.cX;
      tile.tile.y = tile.cY;
    });

    self.view.x = Math.round(400 - x);
    self.view.y = Math.round(300 - y);
    stage.update();
  };

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

}

module.exports = map;
