require('src/global');

$(function () {

  page('/', function () {
    $(document.body).html(require('tpls/index.tpl'));
    console.log('Page Load : init');

    $(document.body).on('submit', '[data-join-game]', function (e) {
      e.preventDefault();
      var pin = $('#connectPin').val();
      if (pin.length != 4) return false;
      page.redirect('/game/' + pin);
    });
  });

  page('/server', function () {
    console.log('Page Load : Server');
    require('src/server/gameServer');
  });

  page('/game/:pin', function (ctx) {
    console.log('Page Load : Game ' + ctx.params.pin);
    localStorage.setItem('_pin', ctx.params.pin);
    require('src/client/gameClient');
  });

  page({
    hashbang: true
  });

});
