/* ------------

Imports the map and calls a ready function. fn(map, heroes)

------------ */

var ready = []; // functions to call when ready
var mapIndex = {}; // the map index.
var mapFile = {}; // the tiled map file
var heroes = {}; // home for heroes object
var npcs = {}; // home for npc object

var mapWorld = {}; // created word from mapFile.

var assetsLoad = [];
var assetsDone = [];

var finishedLoad = false;


function doneLoad() {
  console.log('Trigger Ready');
  _.forEach(ready, function (fn) {
    fn(mapFile, heroes);
  });
}

function hasLoadMap() {
  if (_.isEmpty(mapIndex))
    return console.log('Waiting for mapIndex');
  if (_.isEmpty(mapFile))
    return console.log('Waiting for mapFile');
  if (_.isEmpty(heroes))
    return console.log('Waiting for heroes');
  if (assetsLoad.length < assetsDone.length)
    return console.log('Waiting for assets');
  if (!finishedLoad) {
    finishedLoad = true;
    console.log('All Loaded');
    doneLoad();
  }
}

function preloadImg(path) {
  var load = new Image();
  assetsLoad.push(path);
  load.onload = function () {
    assetsDone.push(path);
    hasLoadMap();
  };
  load.src = path;
}

function b642array(input) {
  /* jshint ignore:start */
  var dec = atob(input),
    i, j, len;
  var ar = new Uint32Array(dec.length / 4);

  for (i = 0, len = dec.length / 4; i < len; i++) {
    ar[i] = 0;
    for (j = 4 - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt((i * 4) + j) << (j << 3);
    }
  }
  return ar;
  /* jshint ignore:end */
}

function buildMap(path) {
  path = _.trimRight(path, '/');

  $.get(path + '/index.json', function (d) {
    mapIndex = _.assign(mapIndex, d);
    $.get(path + '/' + _.trimLeft(mapIndex.mapFile, '/'), function (d) {
      mapFile = _.assign(mapFile, d);

      // build out the map grid from the tiled file
      mapFile.layerObj = {};
      _.forEach(mapFile.layers, function (layer) {
        layer.mapGrid = _.chunk(b642array(layer.data), layer.width);
        mapFile.layerObj[layer.name] = layer;
      });
      mapFile.layers = undefined;

      // build out the sprite sheet for each tileset
      _.forEach(mapFile.tilesets, function (set) {
        preloadImg(path + '/' + _.trimLeft(set.image, '/'));
        console.log(set);
        set.spriteSheet = new createjs.SpriteSheet({
          images: [path + '/' + _.trimLeft(set.image, '/')],
          frames: {
            width: set.tilewidth,
            height: set.tileheight,
            count: set.tilecount,
            spacing: set.spacing,
            margin: set.margin
          }
        });
      });

      hasLoadMap();
    }, 'json');

    // hero sprite sheet preload and build spritesheet
    _.forEach(mapIndex.heroes, function (hero) {
      heroes[hero.slug] = hero;
      preloadImg(path + '/' + _.trimLeft(hero.sprite, '/'));
      hero.spriteSheet = new createjs.SpriteSheet({
        images: [path + '/' + _.trimLeft(hero.sprite, '/')],
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
      });
    });
    hasLoadMap();
  }, 'json');

}

module.exports = {
  build: buildMap,
  ready: function (fn) {
    if (typeof fn == 'function')
      ready.push(fn);
  }
};
