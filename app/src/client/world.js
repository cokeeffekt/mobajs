var players = require('src/client/player');
var npcs = require('src/client/npc');
var easystar = new EasyStar.js();

function worldWrap(mapG, stage, pubsub) {
  var self = this;
  var world = new createjs.Container();

  this.pubsub = pubsub;
  this.stage = stage;
  this.world = world;
  this.players = [];

  this.tileWidth = mapG.tilewidth;
  this.tileHeight = mapG.tileheight;
  this.maxX = mapG.width * this.tileWidth;
  this.maxY = mapG.height * this.tileHeight;


  // layers are rendered to the canvas in order, collisions layer is used for path finding and moving entities and is not cached.
  var layerTypes = ['ground', 'terrain', 'object_below', 'collisions', 'object_above'];

  layerTypes.map(function (ln) {
    world[ln] = new createjs.Container();
    world.addChild(world[ln]);
  });

  world.snapToPixel = true;
  stage.addChild(world);

  // for caching world offset
  var offset = new createjs.Point();

  var dragCatch = 0;
  var worldUpEvent = false;
  world.on('mousedown', function (evt) {
    offset.x = evt.stageX - world.x;
    offset.y = evt.stageY - world.y;

    worldUpEvent = world.on('pressup', function (evt) {
      dragCatch = 0;
      console.log('clicked at', offset);
      if (evt.target.name) {
        var tileData = evt.target.name.split('_');
        console.log(tileData);
        players.goto(parseInt(tileData[1]), parseInt(tileData[2]));
      }
    }, null, true);
  });

  world.on('dblclick', function (evt) {
    console.log(evt);
  });

  world.on('pressmove', function (evt) {
    dragCatch++;

    console.log('moved');
    if (dragCatch > 2) {
      world.off('pressup', worldUpEvent);
      self.setView((evt.stageX - offset.x) + (stage.canvas.width / 2), (evt.stageY - offset.y) + (stage.canvas.height / 2));
    }

  });


  // path finding define walkable
  easystar.setGrid(mapG.layerObj.collisions.mapGrid);
  easystar.setAcceptableTiles([0]);
  easystar.enableDiagonals();

  // build a big ass purple plate for our world container
  var plate = new createjs.Shape();
  plate.graphics.beginFill('Purple').drawRect(0, 0, this.maxX + this.tileWidth, this.maxY + this.tileHeight);

  plate.set({
    alpha: 0.5
  });

  world.ground.addChild(plate);

  layerTypes.map(function (layer) {
    if (!mapG.layerObj[layer]) return;
    var lyr = mapG.layerObj[layer].mapGrid;
    lyr.map(function (row, tileY) {
      row.map(function (col, tileX) {
        //      console.log(col, tileX, tileY);
        var tile = new createjs.Sprite(mapG.tilesets[0].spriteSheet, col - 1);
        tile.paused = true;
        world[layer].addChild(tile);
        tile.name = layer + '_' + tileX + '_' + tileY;
        tile.x = tileX * self.tileWidth;
        tile.y = tileY * self.tileHeight;
        if (layer == 'collisions')
        // tile.alpha = 0.5;
          tile.visible = false;
      });
    });
    // wait 500ms and cache the layer for all the speeds
    if (layer != 'collisions')
      setTimeout(function () {
        world[layer].cache(0, 0, self.maxX, self.maxY);
      }, 500);
  });

}

worldWrap.prototype.onTick = function (event) {
  players.onTick(event);
  npcs.onTick(event);
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

worldWrap.prototype.centerTile = function (tileX, tileY) {
  this.setView(this.stage.canvas.width - (tileX * this.tileWidth), this.stage.canvas.height - (tileY * this.tileHeight));
};

worldWrap.prototype.setView = function (x, y) {

  var world = this.world;
  var stage = this.stage;

  //  console.log(x, y);
  x -= (stage.canvas.width / 2);
  y -= (stage.canvas.height / 2);

  x = Math.min(0, x);
  y = Math.min(0, y);

  x = Math.max(-Math.abs(this.maxX - stage.canvas.width), x);
  y = Math.max(-Math.abs(this.maxY - stage.canvas.height), y);

  world.x = x;
  world.y = y;

  world.centerX = x + (stage.canvas.width / 2);
  world.centerY = y + (stage.canvas.height / 2);
};

worldWrap.prototype.moveTo = function (x, y, duration) {

};

worldWrap.prototype.sortContainer = function () {
  this.world.collisions.sortChildren(function (obj1, obj2, options) {
    if (obj1.y > obj2.y)
      return 1;
    if (obj1.y < obj2.y)
      return -1;
    return 0;
  });
};

worldWrap.prototype.addPlayer = function (playerObject, hero) {
  var world = this.world;
  var stage = this.stage;
  var plobj = new players.new(playerObject, hero, this, stage, this.pubsub);
  return plobj;
};

worldWrap.prototype.addNpc = function (npcObject, tileX, tileY) {
  var world = this.world;
  var stage = this.stage;
  var npobj = new npcs.new(npcObject, tileX, tileY, this, stage);
  return npobj;
};

worldWrap.prototype.walkPath = function (startX, startY, endX, endY, cb) {
  var self = this;
  easystar.findPath(startX, startY, endX, endY, function (path) {
    if (path === null) {
      console.log('Path was not found.');
    } else {
      if (typeof cb == 'function')
        cb(path);
    }
  });
  easystar.calculate();
};

module.exports = worldWrap;
