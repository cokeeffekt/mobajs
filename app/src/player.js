var players = [];

function player(obj, x, y, world, stage) {

  this.world = world;
  x = (Math.round(x / 25) * 25) - 16;
  y = (Math.round(y / 25) * 25) - 32;

  this.focusPlayer = true;
  this.stats = {
    hp: 100,
    speed: 1
  };


  this.sprite = new createjs.Sprite(obj.spriteSheet, 'standdown');

  this.sprite.x = x;
  this.sprite.y = y;

  world.world.layer2.addChild(this.sprite);

  players.push(this);
}

player.prototype.pos = function (x, y) {
  x = (Math.round(x / this.world.tileX) * this.world.tileX) - 16;
  y = (Math.round(y / this.world.tileY) * this.world.tileY) - 32;
  this.sprite.x = x;
  this.sprite.y = y;
  this.world.centerView(x, y + this.world.tileY);
};

function goto(x, y) {
  var player = _.find(players, {
    focusPlayer: true
  });
  player.pos(x, y);
}

module.exports = {
  new: player,
  goto: goto
};
