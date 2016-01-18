var $mapLoader = $('<div>');
$mapLoader.append('<h2>Select Map Folder</h2>');
var $input = $('<input type="file" id="mapfolder" webkitdirectory="">');
$mapLoader.append($input);

$mapLoader.append('<h2>Recently Used</h2>');

var $recentMaps = $('<div class="recentmaps">');
_.forEach(_.keys(localStorage), function (f) {
  if (f.match('_map_title_')) {
    var title = localStorage.getItem(f);
    var $map = $('<div>');
    $map.append('<b>' + title + '</b>');
    var id = f.split('_')[3];
    $map.append('<a class="pullright" data-delmap="' + id + '">[X]</a>');
    $map.append('<a class="pullright" data-loadmap="' + id + '">[LOAD]</a>');

    $recentMaps.append($map);

    console.log('Found recent map ' + title + ' with id : ' + id);
  }
});
$mapLoader.append($recentMaps);

$mapLoader.on('click', '[data-loadmap]', function () {
  var id = $(this).data('loadmap');
  var map = localStorage.getItem('_map_data_' + id);

  var mapData = JSON.parse(map);

  console.log('loading map with id : ' + id);

  $mapLoader.trigger('maploaded', [mapData]);

  console.log(id);
});

$mapLoader.on('click', '[data-delmap]', function () {
  var id = $(this).data('delmap');
  localStorage.removeItem('_map_title_' + id);
  localStorage.removeItem('_map_data_' + id);
  $(this).closest('div').remove();
  console.log(id);
});

$input.on('change', function (e) {

  console.log('Importing map');
  var files = e.originalEvent.target.files;
  var folder = files[0].webkitRelativePath.split('/')[0];
  // check for index.json
  var index = _.find(files, {
    webkitRelativePath: folder + '/index.json'
  });
  if (!index)
    return console.error('missing index.json');

  console.log('Found index.json');
  var okFiles = [];
  // text/javascript application/json
  var retCount = 0;

  console.log('Found ' + files.length + ' files');

  _.forEach(files, function (f) {
    if (!f.type) return;
    if (!f.type.match('image.*') && f.type != 'text/javascript' && f.type != 'application/json')
      return;
    var reader = new FileReader();
    var tf = {
      path: f.webkitRelativePath.replace(folder + '/', ''),
      name: f.name,
      type: f.type,
    };
    okFiles.push(tf);
    reader.onload = function (e) {
      tf.contents = e.target.result;
      retCount++;
      if (retCount === okFiles.length) {
        done();
      }
    };
    if (!f.type.match('image.*'))
      reader.readAsText(f);
    else
      reader.readAsDataURL(f);
  });

  function done() {

    console.log('Using ' + okFiles.length + ' files');

    var mapData = {
      files: okFiles,
      mapId: (JSON.stringify(okFiles)).length
    };
    var index = _.find(mapData.files, {
      path: 'index.json'
    });
    var mapInfo = JSON.parse(index.contents);

    console.log('Storing map with id :' + mapData.mapId);

    localStorage.setItem('_map_title_' + mapData.mapId, mapInfo.title);
    localStorage.setItem('_map_data_' + mapData.mapId, JSON.stringify(mapData));

    $mapLoader.trigger('maploaded', [mapData]);
    console.log('loading map with id : ' + mapData.mapId);
  }
});

module.exports = $mapLoader;
