var npcs = [];

function npc(obj, tileX, tileY, world, stage) {
  console.log(obj);

  // container for player
  var self = this;
  this.world = world;
  this.stage = stage;
  this.currentDirection = 'down';
  this.walkingPath = [];
  this.walking = false;
  this.directionPref = 'y';

  this.npCont = new createjs.Container();

  var plate = new createjs.Shape();
  plate.graphics.beginFill('Red').drawRoundRect(0, (world.tileHeight / 2) + (world.tileHeight / 8), world.tileWidth, world.tileHeight / 2, 10);
  plate.set({
    alpha: 0.3
  });

  this.npCont.addChild(plate);

  world.world.collisions.addChild(this.npCont);

  this.npCont.x = tileX * world.tileWidth;
  this.npCont.y = tileY * world.tileHeight;

  this.sprite = new createjs.Sprite(obj.spriteSheet, 'stand_down');
  this.sprite.x = -8;
  this.sprite.y = -16;
  this.npCont.addChild(this.sprite);
  npcs.push(this);

  console.log(this.npCont);

  this.setPos(tileX, tileY, 0);

}

npc.prototype.setPos = function (tileX, tileY, duration, cb) {

  var self = this;
  var direction;

  self.lastTileX = self.currentTileX || tileX;
  self.lastTileY = self.currentTileY || tileX;

  if (this.lastTileY < tileY)
    direction = 'down';
  if (this.lastTileY > tileY)
    direction = 'up';
  if (this.lastTileX < tileX)
    direction = 'right';
  if (this.lastTileX > tileX)
    direction = 'left';

  // fix wonky direction thingys
  if (this.directionPref == 'y') {
    if (this.lastTileY < tileY)
      direction = 'down';
    if (this.lastTileY > tileY)
      direction = 'up';
  }

  if (this.currentDirection != direction) {
    this.currentDirection = direction;
    this.sprite.stop();
  }

  this.sprite.gotoAndPlay('walk_' + this.currentDirection);
  self.walking = true;
  this.world.sortContainer();
  createjs.Tween.get(this.npCont, {
      override: true
    })
    .to({
      x: tileX * this.world.tileWidth,
      y: tileY * this.world.tileHeight,
    }, duration)
    .call(function () {
      self.walking = false;
      if (typeof cb == 'function')
        cb();
      self.currentX = self.npCont.x;
      self.currentY = self.npCont.y;
      self.currentTileX = tileX;
      self.currentTileY = tileY;
    });
};

npc.prototype.walkPath = function () {
  var self = this;
  if (self.walkingPath.length < 1) {
    self.sprite.gotoAndStop('stand_' + self.currentDirection);
    return console.log('done');
  }
  var toTile = self.walkingPath[0];
  self.setPos(toTile.x, toTile.y, 1000, function () {
    _.pullAt(self.walkingPath, 0);
    self.walkPath();
  });
};

npc.prototype.walkTo = function (tileX, tileY) {
  var self = this;
  this.world.walkPath(this.currentTileX, this.currentTileY, tileX, tileY, function (path) {
    _.pullAt(path, 0);
    self.walkingPath = path;

    var first = path[0];
    var last = path[path.length - 1];
    if (Math.abs(first.x - last.x) > Math.abs(first.y - last.y))
      self.directionPref = 'x';
    else
      self.directionPref = 'y';

    self.walkPath();
  });
};

function onTick(event) {

}

module.exports = {
  new: npc,
  onTick: onTick
};
