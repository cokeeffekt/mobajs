function worldWrap(mapG, tileTypes, stage) {

  var world = new createjs.Container();
  stage.addChild(world);

  //  var viewDrag = new createjs.Shape(new createjs.Graphics().beginFill('Purple').drawRect(0, 0, stage.canvas.width, stage.canvas.height)).set({
  //    alpha: 0
  //  });
  //
  //  stage.addChild(viewDrag);
  var offset = new createjs.Point();
  world.centerX = (stage.canvas.width / 2);
  world.centerY = (stage.canvas.height / 2);

  world.on('mousedown', function (evt) {
    offset.x = evt.stageX - world.x;
    offset.y = evt.stageY - world.y;
    console.log('down');
  });
  world.on('pressmove', function (evt) {
    var x = evt.stageX - offset.x;
    var y = evt.stageY - offset.y;
    world.x = Math.max(Math.min(x, 0), -Math.abs(offset.maxX - stage.canvas.width));
    world.y = Math.max(Math.min(y, 0), -Math.abs(offset.maxY - stage.canvas.height));
    world.centerX = Math.abs(world.x) + (stage.canvas.width / 2);
    world.centerY = Math.abs(world.y) + (stage.canvas.height / 2);
    cleanUp();
  });

  mapG[0][0] = 0;
  mapG[0][1] = 0;
  mapG[1][1] = 0;

  var mapC = [];

  offset.maxY = (mapG.length - 1) * 25;
  offset.maxX = (mapG[0].length - 1) * 25;

  mapG.map(function (row, rowI) {
    row.map(function (col, colI) {
      //      if (col === 0)
      mapC.push({
        x: colI,
        y: rowI,
        cX: colI * 25,
        cY: rowI * 25,
        tile: tileTypes[col].clone()
      });
    });
  });
  //
  var plate = new createjs.Shape();
  plate.graphics.beginFill('Purple').drawRect(0, 0, offset.maxX + 25, offset.maxY + 25);
  world.addChild(plate);
  var current = {
    x: 0,
    y: 0
  };


  function cleanUp() {
    mapC.map(function (tile) {
      if (tile.cX < (world.centerX + 200) && tile.cY < (world.centerY + 200) && tile.cX > (world.centerX - 200) && tile.cY > (world.centerY - 200)) {
        tile.child = world.addChild(tile.tile);
        tile.tile.x = tile.cX;
        tile.tile.y = tile.cY;
      } else {
        world.removeChild(tile.child);
      }
    });
    //    console.log(world.children[0]);
    console.log(world.children.length);
  }

  cleanUp();
  //  var reduce = _.filter(mapC, function (i) {
  //    //    if (i.cX < (offset.x + 400) && i.cY < (offset.y + 300) && i.cX > (offset.x - 400) && i.cY > (offset.y - 300))
  //    return true;
  //    //    world.removeChild(i.title);
  //    //    return false;
  //  });
  //  //    var reduce = mapC;
  //
  //  reduce.map(function (tile) {
  //
  //    world.addChild(tile.tile);
  //    tile.tile.x = tile.cX;
  //    tile.tile.y = tile.cY;
  //  });

  //  createjs.Tween.get(self.view).to({
  //    x: Math.round(400 - x),
  //    y: Math.round(300 - y)
  //  }, time);

  //    self.view.x = Math.round(400 - x);
  //    self.view.y = Math.round(300 - y);
  //    stage.update();

}

module.exports = worldWrap;
