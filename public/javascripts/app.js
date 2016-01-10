(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("src/init", function(exports, require, module) {
var mapG = (function () {
  var map = [];
  var xCount = 0;
  var yCount = 0;
  var row = [];
  while (xCount < 50) {
    xCount++;
    yCount = 0;
    row = [];
    while (yCount < 50) {
      row.push((_.random(1, 4) == 1 ? 1 : 0));
      yCount++;
    }
    map.push(row);
  }

  return map;
})();

var map = require('src/map');

var tileTypes = {
  0: (function () {
    var t = new createjs.Shape();
    t.graphics.beginFill('Green').drawRect(0, 0, 25, 25);
    return t;
  })(),
  1: (function () {
    var t = new createjs.Shape();
    t.graphics.beginFill('Black').drawRect(0, 0, 25, 25);
    return t;
  })(),
};

$(function () {
  //set world stage
  var viewport = new createjs.Stage('world');
  var mm = new map(mapG, tileTypes, viewport);

  var player = (function () {
    var entity = new createjs.Container();

    var circle = new createjs.Shape();
    circle.graphics.beginFill('DeepSkyBlue').drawRect(0, 0, 25, 25);
    var circlee = new createjs.Shape();
    circlee.graphics.beginFill('red').drawCircle(12.5, 12.5, 5);

    entity.addChild(circle);
    entity.addChild(circlee);
    entity.x = 400;
    entity.y = 300;

    entity.worldX = 0;
    entity.worldY = 0;
    return entity;
  })();

  console.log(player);


  player.addEventListener('click', function (evt) {
    console.log(evt);
  });

  viewport.addEventListener('stagemousedown', function (evt) {

    var current = {
      x: player.worldX,
      y: player.worldY,
    };
    var x = player.worldX + ((evt.stageX - 12) - 400);
    x = Math.round(x / 25) * 25;

    var y = player.worldY + ((evt.stageY - 12) - 300);
    y = Math.round(y / 25) * 25;

    mm.path(current, {
      x: Math.min(Math.max(x, 0), mm.maxX),
      y: Math.min(Math.max(y, 0), mm.maxY)
    }, function (path) {
      console.log(path);

      _.forEach(path, function (p, i) {
        setTimeout(function () {
          mm.set(p.x, p.y);
          player.worldX = p.x;
          player.worldY = p.y;
        }, i * 100);
      });

    });

    //    mm.set(player.worldX, player.worldY);

    console.log('Player Pos:', player.worldX, player.worldY);
  });


  viewport.addChild(mm.view);
  viewport.addChild(player);
  mm.set(player.worldX, player.worldY);


  function handleTick() {
    viewport.addChild(player);
    viewport.update();
  }

  createjs.Ticker.setFPS(30);
  //  createjs.Ticker.addEventListener('tick', handleTick);

});

});

require.register("src/map", function(exports, require, module) {
function map(mapG, tileTypes, stage) {

  mapG[0][0] = 0;
  mapG[0][1] = 0;
  mapG[1][1] = 0;

  var self = this;
  this.view = new createjs.Container();

  var mapC = [];

  this.maxY = (mapG.length - 1) * 25;
  this.maxX = (mapG[0].length - 1) * 25;

  console.log(this.maxY);
  console.log(this.maxX);

  mapG.map(function (row, rowI) {
    row.map(function (col, colI) {
      mapC.push({
        x: colI,
        y: rowI,
        cX: colI * 25,
        cY: rowI * 25,
        tile: tileTypes[col].clone()
      });
    });
  });

  var plate = new createjs.Shape();
  plate.graphics.beginFill('Purple').drawRect(0, 0, this.maxY + 25, this.maxX + 25);

  var current = {
    x: 0,
    y: 0
  };


  this.set = function (x, y) {

    self.view.removeAllChildren();
    self.view.addChild(plate);

    var reduce = _.filter(mapC, function (i) {
      if (i.cX < (x + 400) && i.cY < (y + 300) && i.cX > (x - 400) && i.cY > (y - 300))
        return true;
      return false;
    });
    //    var reduce = mapC;

    reduce.map(function (tile) {
      self.view.addChild(tile.tile);
      tile.tile.x = tile.cX;
      tile.tile.y = tile.cY;
    });

    self.view.x = Math.round(400 - x);
    self.view.y = Math.round(300 - y);
    stage.update();
  };

  // path finding
  var easystar = new EasyStar.js();
  easystar.setGrid(mapG);
  easystar.setAcceptableTiles([0]);
  easystar.enableDiagonals();

  this.path = function (from, too, cb) {

    from.x = Math.round(from.x / 25);
    from.y = Math.round(from.y / 25);

    too.x = Math.round(too.x / 25);
    too.y = Math.round(too.y / 25);

    console.log(from, too);

    easystar.findPath(from.x, from.y, too.x, too.y, function (path) {
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

}

module.exports = map;

});


//# sourceMappingURL=app.js.map
