function worldWrap(mapG, tileTypes, stage) {

  var world = new createjs.Container();
  stage.addChild(world);

  //  var viewDrag = new createjs.Shape(new createjs.Graphics().beginFill('Purple').drawRect(0, 0, stage.canvas.width, stage.canvas.height)).set({
  //    alpha: 0
  //  });
  //
  //  stage.addChild(viewDrag);
  var offset = new createjs.Point();

  world.on('mousedown', function (evt) {
    offset.x = evt.stageX - world.x;
    offset.y = evt.stageY - world.y;
  });
  world.on('pressmove', function (evt) {
    world.x = Math.min(evt.stageX - offset.x, 0);
    world.y = Math.min(evt.stageY - offset.y, 0);
  });



  // Create lots of things on the stage.
  //  var g = new createjs.Graphics().beginFill('#E8DEDE').drawCircle(0, 0, 50);
  //  for (var i = 0, l = 300; i < l; i++) {
  //    var scale = Math.random() * 3 - 2.5;
  //    var box = new createjs.Shape(g)
  //      .set({
  //        scaleX: scale,
  //        scaleY: scale,
  //        alpha: Math.random() * 0.5 + 0.5,
  //        x: Math.random() * 5000 - 2500,
  //        y: Math.random() * 5000 - 2500
  //      });
  //    dragContainer.addChild(box);
  //  }


  //  function startDrag(event) {
  //    console.log(event, this);
  //    offset.x = stage.mouseX - dragContainer.x;
  //    offset.y = stage.mouseY - dragContainer.y;
  //    event.currentTarget.addEventListener('mousemove', doDrag);
  //  }
  //
  //  function doDrag(event) {
  //    dragContainer.x = event.stageX - offset.x;
  //    dragContainer.y = event.stageY - offset.y;
  //  }

  // Update the stage
  //  function tick(event) {
  //    stage.update();
  //  }

  mapG[0][0] = 0;
  mapG[0][1] = 0;
  mapG[1][1] = 0;
  //
  //  var self = this;
  //  this.view = new createjs.Container();
  //
  var mapC = [];
  //
  //  this.currentX = 0;
  //  this.currentY = 0;
  this.maxY = (mapG.length - 1) * 25;
  this.maxX = (mapG[0].length - 1) * 25;
  //
  //  console.log(this.maxY);
  //  console.log(this.maxX);
  //
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
  plate.graphics.beginFill('Purple').drawRect(0, 0, this.maxY + 25, this.maxX + 25);
  world.addChild(plate);
  var current = {
    x: 0,
    y: 0
  };

  var reduce = _.filter(mapC, function (i) {
    //    if (i.cX < (offset.x + 400) && i.cY < (offset.y + 300) && i.cX > (offset.x - 400) && i.cY > (offset.y - 300))
    return true;
    //    world.removeChild(i.title);
    //    return false;
  });
  //    var reduce = mapC;

  reduce.map(function (tile) {
    world.addChild(tile.tile);
    tile.tile.x = tile.cX;
    tile.tile.y = tile.cY;
  });

  //  createjs.Tween.get(self.view).to({
  //    x: Math.round(400 - x),
  //    y: Math.round(300 - y)
  //  }, time);

  //    self.view.x = Math.round(400 - x);
  //    self.view.y = Math.round(300 - y);
  //    stage.update();

}

module.exports = worldWrap;
