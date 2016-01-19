## links
http://linguistats.com/blog/coding/easeljs-scrolling-or-dragging-the-stage/
http://charas-project.net/
http://opengameart.org/
    http://opengameart.org/content/lots-of-free-2d-tiles-and-sprites-by-hyptosis

http://shaneriley.com/demos/canvas/tiled_renderer/

https://github.com/gaurav0/Universal-LPC-Spritesheet-Character-Generator

http://www.gamefromscratch.com/post/2015/10/14/Tiled-Map-Editor-Tutorial-Series.aspx


https://github.com/muaz-khan/WebRTC-Experiment/tree/master/DataChannel
http://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas

```
ngp8uf0sfackgldi
```

may need this
https://github.com/turuslan/HackTimer

## spells
https://mrbubblewand.wordpress.com/download/
http://www.charas-project.net/forum/index.php?topic=26447.0


## mob

http://www.rpgmakervxace.net/topic/2399-grannys-lists-animal-sprites/

Canvas

world(container)
  Map Tiles, Animations, Player, Other Entities
  
Viewport (X,Y)

## Layers

 - 'ground' - ground layer
 - 'terrain' - terain layer
 - 'object_below' - renders below collision layer
 - 'collisions' - not tiles rendered on this display, any tile on this layer will not be walkable, this layer is where heroes and players exist
 - 'object_above' - renders above collision layer
 
 
## Maps

Maps are a bunch of json files, some images and a javascript file. An index.json file is required.

#### index.json

```
{
  // title of the map
  "title": "Enfo's Co-op Survival",
  // link to the exported tiled json file.
  "mapFile": "map.json",
  "maxPlayers": 8,
  // defines an array of heros, each with there own properties
  "heroes": [{
    "title": "Naked Man",
    "slug": "naked-man",
    "sprite": "naked.png"
  }],
  // defines an array of npcs
  "npcs": [{
    "title": "White Dragon",
    "slug": "white-dragon",
    "sprite": "mobs/white-dragon.png",
    "width": 48,
    "height": 48
  }]
}
```
#### Tiled Map Files

Tiled is a map/terrain building tool which can exports maps to json. Download it from http://www.mapeditor.org/

These layers (in order) are required, even if they are blank.

 - 'ground' - ground layer
 - 'terrain' - terain layer
 - 'object_below' - renders below collision layer
 - 'collisions' - not tiles rendered on this display, any tile on this layer will not be walkable, this layer is where heroes and players exist
 - 'object_above' - renders above collision layer

  
#### Heroes
  
Heroes sprite sheets are hardcoded you can use the following url to generate your own

http://gaurav.munjal.us/Universal-LPC-Spritesheet-Character-Generator/
 



<input type="file" name="file_input[]" id="file_input" webkitdirectory="">