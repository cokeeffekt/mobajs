var players = [];

function player(obj, hero, world, stage, pubsub) {

  var tileX = hero.tileX;
  var tileY = hero.tileY;

  // container for player
  var self = this;
  this.owner = hero.username;
  this.hero = hero;
  this.pubsub = pubsub;
  this.world = world;
  this.stage = stage;
  this.focusPlayer = hero.owned || false;
  this.currentDirection = 'down';
  this.walkingPath = [];
  this.walking = false;
  this.directionPref = 'y';

  this.plCont = new createjs.Container();

  var plate = new createjs.Shape();
  plate.graphics.beginFill('Green').drawRoundRect(0, (world.tileHeight / 2) + (world.tileHeight / 8), world.tileWidth, world.tileHeight / 2, 10);
  plate.set({
    alpha: (this.focusPlayer ? 0.3 : 0)
  });

  this.plCont.addChild(plate);


  world.world.collisions.addChild(this.plCont);
  world.world.collisions.addChild(this.plCont);

  this.plCont.x = tileX * world.tileWidth;
  this.plCont.y = tileY * world.tileHeight;

  this.sprite = new createjs.Sprite(obj.spriteSheet, 'stand_down');
  this.sprite.gotoAndStop('stand_down');
  this.sprite.x = -16;
  this.sprite.y = -32;
  this.plCont.addChild(this.sprite);
  players.push(this);

  this.setPos(tileX, tileY, 0);
  this.walkTo(tileX, tileY + 1);


  if (!this.hero.owned) {
    this.pubsub.on('player-move:' + this.hero.username, function (data, event) {
      self.setPos(data.tileX, data.tileY, data.duration);
    });
  }
}

player.prototype.setPos = function (tileX, tileY, duration, cb) {

  if (this.hero.owned) {
    this.pubsub.emit('player-move', {
      tileX: tileX,
      tileY: tileY,
      duration: duration
    });
  }


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
  if (duration === 0) {

    this.plCont.x = tileX * this.world.tileWidth;
    this.plCont.y = tileY * this.world.tileHeight;
    if (typeof cb == 'function')
      cb();

    self.currentX = self.plCont.x;
    self.currentY = self.plCont.y;
    self.currentTileX = tileX;
    self.currentTileY = tileY;

    console.log(this.sprite);

    return;
  }
  createjs.Tween.get(this.plCont, {
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
      if (self.walkingPath.length < 1) {
        console.log('set Stand');
        self.sprite.gotoAndStop('stand_' + self.currentDirection);
      }

      self.currentX = self.plCont.x;
      self.currentY = self.plCont.y;
      self.currentTileX = tileX;
      self.currentTileY = tileY;
    });
};

// loops the walking path until its done;
player.prototype.walkPath = function () {
  var self = this;
  if (self.walkingPath.length < 1) {
    return console.log('done');
  }
  var toTile = self.walkingPath[0];
  self.setPos(toTile.x, toTile.y, (500 / this.hero.stats.speed), function () {
    _.pullAt(self.walkingPath, 0);
    self.walkPath();
  });
};

// builds a walking path and appends the path to the hero, then starts it
player.prototype.walkTo = function (tileX, tileY) {
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

player.prototype.centerView = function () {
  this.world.setView(this.stage.canvas.width - this.plCont.x, this.stage.canvas.height - this.plCont.y);
};

function goto(tileX, tileY) {
  var player = _.find(players, {
    focusPlayer: true
  });
  player.walkTo(tileX, tileY);
}

function onTick(event) {
  var player = _.find(players, {
    focusPlayer: true,
    walking: true
  });
  if (player)
    player.centerView();
}

module.exports = {
  new: player,
  goto: goto,
  onTick: onTick
};
