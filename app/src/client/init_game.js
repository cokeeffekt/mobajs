var world = require('src/world');
var map = require('src/map');

$(function () {
  map.ready(function (mapObj, heroObj, npcObj) {
    console.log('Map Ready');
    $('#loader').hide();

    var $fps = $('#fps');
    var stage = new createjs.Stage('world');

    var $world = new world(mapObj, stage);

    console.log(heroObj);



    function handleTick(event) {
      $fps.text('FPS   :   ' + (createjs.Ticker.getMeasuredFPS()).toFixed(2) || 0);
      $world.onTick(event);
      stage.update(event);
    }

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', handleTick);


    //    $world.addPlayer(heroObj['naked-man'], 18, 46);

    // wave 1 test

    //    var count = 1;
    //    while (count < 20) {
    //      count++;
    //      setTimeout(function () {
    //        var firstnpc = $world.addNpc(npcObj['white-dragon'], 5, 3);
    //        setTimeout(function () {
    //          firstnpc.walkTo(18, 47);
    //        }, 500);
    //      }, 3000 * count);
    //    }


  });

  map.build('/maps/enfost/');
});
