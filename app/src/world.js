var players = require('src/player');

function worldWrap(mapG, tileTypes, stage) {
  var self = this;
  var world = new createjs.Container();
  this.stage = stage;
  this.world = world;
  this.players = [];

  this.tileX = 32;
  this.tileY = 32;

  world.layer1 = new createjs.Container();
  world.layer2 = new createjs.Container();
  world.addChild(world.layer1);
  world.addChild(world.layer2);

  world.snapToPixel = true;
  stage.addChild(world);

  // for caching world offset
  var offset = new createjs.Point();

  var worldUpEvent = false;
  world.on('mousedown', function (evt) {
    offset.x = evt.stageX - world.x;
    offset.y = evt.stageY - world.y;

    worldUpEvent = world.on('pressup', function (evt) {
      console.log(offset);
      console.log(evt.target.name);

      players.goto(offset.x - (self.tileX / 2), offset.y - (self.tileY / 2));
    }, null, true);
  });

  world.on('pressmove', function (evt) {
    world.off('pressup', worldUpEvent);
    self.setView((evt.stageX - offset.x) + (stage.canvas.width / 2), (evt.stageY - offset.y) + (stage.canvas.height / 2));
  });


  mapG[0][0] = 0;
  mapG[0][1] = 0;
  mapG[1][1] = 0;

  // path finding define walkable

  this.easystar = new EasyStar.js();
  this.easystar.setGrid(mapG);
  this.easystar.setAcceptableTiles([0]);
  this.easystar.enableDiagonals();

  var mapC = [];

  this.maxX = (mapG[0].length) * this.tileY;
  this.maxY = (mapG.length) * this.tileX;

  mapG.map(function (row, rowI) {
    row.map(function (col, colI) {
      mapC.push({
        x: colI,
        y: rowI,
        cX: colI * self.tileX,
        cY: rowI * self.tileY,
        tile: tileTypes[col].clone()
      });
    });
  });
  //
  var plate = new createjs.Shape();
  plate.graphics.beginFill('Purple').drawRect(0, 0, this.maxX + this.tileX, this.maxY + this.tileY);

  plate.set({
    alpha: 0.5
  });

  world.layer1.addChild(plate);


  mapC.map(function (tile) {
    world.layer1.addChild(tile.tile);
    tile.tile.name = 'map_' + tile.x + '_' + tile.y;
    tile.tile.x = tile.cX;
    tile.tile.y = tile.cY;
  });
  world.layer1.cache(0, 0, this.maxX, this.maxY);

}

worldWrap.prototype.onTick = function (event) {

};

worldWrap.prototype.centerView = function (x, y) {
  var world = this.world;
  var stage = this.stage;
  x = -Math.abs(x) + (stage.canvas.width / 2);
  y = -Math.abs(y) + (stage.canvas.height / 2);

  x = Math.min(0, x);
  y = Math.min(0, y);

  x = Math.max(-Math.abs(this.maxX - stage.canvas.width), x);
  y = Math.max(-Math.abs(this.maxY - stage.canvas.height), y);

  world.x = x;
  world.y = y;
};

worldWrap.prototype.setView = function (x, y) {
  var world = this.world;
  var stage = this.stage;

  console.log(x, y);
  x -= (stage.canvas.width / 2);
  y -= (stage.canvas.height / 2);

  x = Math.min(0, x);
  y = Math.min(0, y);

  x = Math.max(-Math.abs(this.maxX - stage.canvas.width), x);
  y = Math.max(-Math.abs(this.maxY - stage.canvas.height), y);

  world.x = x;
  world.y = y;

  world.centerX = x + (stage.canvas.width / 2);
  world.centerY = x + (stage.canvas.height / 2);
};

worldWrap.prototype.moveTo = function (x, y, duration) {

};

worldWrap.prototype.addPlayer = function (playerObject, x, y) {
  var world = this.world;
  var stage = this.stage;
  var plobj = new players.new(playerObject, x, y, this, stage);
};

worldWrap.prototype.walkPath = function (from, to, cb) {
  var self = this;
  this.easystar.findPath(from[0], from[1], to[0], to[1], function (path) {
    if (path === null) {
      console.log('Path was not found.');
    } else {
      path.map(function (t) {
        t.x = t.x * self.tileX;
        t.y = t.y * self.tileY;
      });
      if (typeof cb == 'function')
        cb(path);
    }
  });
  easystar.calculate();
};

module.exports = worldWrap;
