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

  var animEnt = {
    images: [obj.image],
    frames: {
      width: 64,
      height: 64
    },
    animations: {
      standup: 0 * 13,
      standleft: 1 * 13,
      standdown: 2 * 13,
      standright: 3 * 13,

      castup: [0 * 13, (0 * 13) + 6, 'standup'],
      castleft: [1 * 13, (1 * 13) + 6, 'standleft'],
      castdown: [2 * 13, (2 * 13) + 6, 'standdown'],
      castright: [3 * 13, (3 * 13) + 6, 'standright'],

      thrustup: [4 * 13, (4 * 13) + 7, 'standup'],
      thrustleft: [5 * 13, (5 * 13) + 7, 'standleft'],
      thrustdown: [6 * 13, (6 * 13) + 7, 'standdown'],
      thrustright: [7 * 13, (7 * 13) + 7, 'standright'],

      walkup: [8 * 13, (8 * 13) + 8, 'standup'],
      walkleft: [9 * 13, (9 * 13) + 8, 'standleft'],
      walkdown: [10 * 13, (10 * 13) + 8, 'standdown'],
      walkright: [11 * 13, (11 * 13) + 8, 'standright'],

      slashup: [12 * 13, (12 * 13) + 5, 'standup'],
      slashleft: [13 * 13, (13 * 13) + 5, 'standleft'],
      slashdown: [14 * 13, (14 * 13) + 5, 'standdown'],
      slashright: [15 * 13, (15 * 13) + 5, 'standright'],

      bowup: [16 * 13, (16 * 13) + 12, 'standup'],
      bowleft: [17 * 13, (17 * 13) + 12, 'standleft'],
      bowdown: [18 * 13, (18 * 13) + 12, 'standdown'],
      bowright: [19 * 13, (19 * 13) + 12, 'standright'],

      die: [20 * 13, (20 * 13) + 5]
    },
    framerate: 30
  };

  var spriteSheet = new createjs.SpriteSheet(animEnt);
  this.sprite = new createjs.Sprite(spriteSheet, 'standdown');

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
