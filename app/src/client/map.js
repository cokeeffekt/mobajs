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
  setTimeout(function () {
    console.log('Trigger Ready');
    _.forEach(ready, function (fn) {
      fn(mapFile, heroes, npcs);
    });
  }, 3000);
}

function hasLoadMap() {
  if (_.isEmpty(mapIndex))
    return console.log('Waiting for mapIndex');
  if (_.isEmpty(mapFile))
    return console.log('Waiting for mapFile');
  if (_.isEmpty(heroes))
    return console.log('Waiting for heroes');
  if (_.isEmpty(npcs))
    return console.log('Waiting for npcs');
  if (assetsLoad.length < assetsDone.length)
    return console.log('Waiting for assets');
  if (!finishedLoad) {
    finishedLoad = true;
    console.log('All Loaded');
    doneLoad();
  }
}


function buildMap(mapData) {

  console.log(mapData);

  mapIndex = JSON.parse(_.find(mapData.files, {
    path: 'index.json'
  }).contents);

  mapFile = JSON.parse(_.find(mapData.files, {
    path: mapIndex.mapFile
  }).contents);



  // build out the map grid from the tiled file
  mapFile.layerObj = {};
  _.forEach(mapFile.layers, function (layer) {
    if (!layer.data) return;
    layer.mapGrid = _.chunk(b642array(layer.data), layer.width);
    mapFile.layerObj[layer.name] = layer;
  });
  mapFile.layers = undefined;

  console.log(mapFile);

  // build out the sprite sheet for each tileset
  _.forEach(mapFile.tilesets, function (set) {

    console.log(set);
    var img = _.find(mapData.files, {
      path: set.image
    }).contents;
    set.spriteSheet = new createjs.SpriteSheet({
      images: [img],
      frames: {
        width: set.tilewidth,
        height: set.tileheight,
        count: set.tilecount,
        spacing: set.spacing,
        margin: set.margin
      }
    });
  });

  // hero sprite sheet preload and build spritesheet
  // this is hardcoded to work from LPC generated files.
  // https://github.com/gaurav0/Universal-LPC-Spritesheet-Character-Generator

  _.forEach(mapIndex.heroes, function (hero) {
    heroes[hero.slug] = hero;

    var img = _.find(mapData.files, {
      path: hero.sprite
    }).contents;
    hero.spriteSheet = new createjs.SpriteSheet({
      images: [img],
      frames: {
        width: 64,
        height: 64
      },
      animations: {
        stand_up: 0 * 13,
        stand_left: 1 * 13,
        stand_down: 2 * 13,
        stand_right: 3 * 13,

        cast_up: [0 * 13, (0 * 13) + 6],
        cast_left: [1 * 13, (1 * 13) + 6],
        cast_down: [2 * 13, (2 * 13) + 6],
        cast_right: [3 * 13, (3 * 13) + 6],

        thrust_up: [4 * 13, (4 * 13) + 7],
        thrust_left: [5 * 13, (5 * 13) + 7],
        thrust_down: [6 * 13, (6 * 13) + 7],
        thrust_right: [7 * 13, (7 * 13) + 7],

        walk_up: [8 * 13, (8 * 13) + 8, (8 * 13) + 1],
        walk_left: [9 * 13, (9 * 13) + 8, (9 * 13) + 1],
        walk_down: [10 * 13, (10 * 13) + 8, (10 * 13) + 1],
        walk_right: [11 * 13, (11 * 13) + 8, (11 * 13) + 1],

        slash_up: [12 * 13, (12 * 13) + 5],
        slash_left: [13 * 13, (13 * 13) + 5],
        slash_down: [14 * 13, (14 * 13) + 5],
        slash_right: [15 * 13, (15 * 13) + 5],

        bow_up: [16 * 13, (16 * 13) + 12],
        bow_left: [17 * 13, (17 * 13) + 12],
        bow_down: [18 * 13, (18 * 13) + 12],
        bow_right: [19 * 13, (19 * 13) + 12],

        die: [20 * 13, (20 * 13) + 5]
      },
      framerate: 10
    });
  });


  _.forEach(mapIndex.npcs, function (npc) {
    npcs[npc.slug] = npc;

    var img = _.find(mapData.files, {
      path: npc.sprite
    }).contents;

    npc.spriteSheet = new createjs.SpriteSheet({
      images: [img],
      frames: {
        width: npc.width,
        height: npc.width
      },
      animations: {
        stand_down: 1,
        stand_left: 4,
        stand_right: 7,
        stand_up: 10,

        walk_down: [0, 2],
        walk_left: [3, 5],
        walk_right: [6, 8],
        walk_up: [9, 11]
      },
      framerate: 10
    });
  });

  hasLoadMap();

}

module.exports = {
  build: buildMap,
  ready: function (fn) {
    if (typeof fn == 'function')
      ready.push(fn);
  }
};
