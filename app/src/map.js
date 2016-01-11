function map(mapG, tileTypes, stage) {

  mapG[0][0] = 0;
  mapG[0][1] = 0;
  mapG[1][1] = 0;

  var self = this;
  this.view = new createjs.Container();

  var mapC = [];

  this.currentX = 0;
  this.currentY = 0;
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
  self.view.addChild(plate);
  var current = {
    x: 0,
    y: 0
  };


  this.set = function (x, y, time) {

    self.currentX = x;
    self.currentY = y;
    //    self.view.removeAllChildren();
    //    self.view.addChild(plate);

    var reduce = _.filter(mapC, function (i) {
      if (i.cX < (x + 400) && i.cY < (y + 300) && i.cX > (x - 400) && i.cY > (y - 300))
        return true;
      self.view.removeChild(i.title);
      return false;
    });
    //    var reduce = mapC;

    reduce.map(function (tile) {
      self.view.addChild(tile.tile);
      tile.tile.x = tile.cX;
      tile.tile.y = tile.cY;
    });

    createjs.Tween.get(self.view).to({
      x: Math.round(400 - x),
      y: Math.round(300 - y)
    }, time);

    //    self.view.x = Math.round(400 - x);
    //    self.view.y = Math.round(300 - y);
    //    stage.update();
  };

}

module.exports = map;
