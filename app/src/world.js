var player = require('src/player');

function worldWrap(mapG, tileTypes, stage) {
  var self = this;
  var world = new createjs.Container();
  this.stage = stage;
  this.world = world;
  this.players = [];

  world.layer1 = new createjs.Container();
  world.layer2 = new createjs.Container();
  world.addChild(world.layer1);
  world.addChild(world.layer2);

  this.config = {
    tileX: 32,
    tileY: 32,
  };

  world.snapToPixel = true;
  stage.addChild(world);

  var offset = new createjs.Point();
  world.centerX = (stage.canvas.width / 2);
  world.centerY = (stage.canvas.height / 2);


  var worldUpEvent = false;
  world.on('mousedown', function (evt) {
    offset.x = Math.round(evt.stageX - world.x);
    offset.y = Math.round(evt.stageY - world.y);
    worldUpEvent = world.on('pressup', function (evt) {
      console.log(evt);
    }, null, true);
  });

  world.on('pressmove', function (evt) {
    world.off('pressup', worldUpEvent);
    var x = Math.abs(Math.max(Math.min((evt.stageX - offset.x), 0), -Math.abs(offset.maxX - stage.canvas.width))) + (stage.canvas.width / 2);
    var y = Math.abs(Math.max(Math.min((evt.stageY - offset.y), 0), -Math.abs(offset.maxY - stage.canvas.height))) + (stage.canvas.height / 2);
    self.set(x, y);
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

  offset.maxY = (mapG.length - 1) * self.config.tileX;
  offset.maxX = (mapG[0].length - 1) * self.config.tileY;

  mapG.map(function (row, rowI) {
    row.map(function (col, colI) {
      //      if (col === 0)
      mapC.push({
        x: colI,
        y: rowI,
        cX: colI * self.config.tileX,
        cY: rowI * self.config.tileY,
        tile: tileTypes[col].clone()
      });
    });
  });
  //
  var plate = new createjs.Shape();
  plate.graphics.beginFill('Purple').drawRect(0, 0, offset.maxX + this.config.tileX, offset.maxY + this.config.tileY);

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
  world.layer1.cache(0, 0, offset.maxX, offset.maxY);

  console.log(mapC[0].tile);
}

worldWrap.prototype.onTick = function (event) {

};

worldWrap.prototype.set = function (x, y) {
  var world = this.world;
  var stage = this.stage;
  world.x = -Math.abs(x - (stage.canvas.width / 2));
  world.y = -Math.abs(y - (stage.canvas.height / 2));
  world.centerX = x;
  world.centerY = y;
};

worldWrap.prototype.moveTo = function (x, y, duration) {

};

worldWrap.prototype.addPlayer = function (playerObject, x, y) {
  var world = this.world;
  var stage = this.stage;
  var players = this.players;
  var plobj = new player(playerObject, x, y, world, stage);

  players.push(plobj);
};

worldWrap.prototype.walkPath = function (from, to, cb) {
  var config = this.config;
  this.easystar.findPath(from[0], from[1], to[0], to[1], function (path) {
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

module.exports = worldWrap;
