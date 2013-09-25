var body, canvas, context;
body = canvas = context = null;

var images = [];
var hoverboard = null;
var hb_status = null;
var tree       = null;
var world_x = 0;
var world_y = 0;

// opposite of horizon
// set by bottom edge of hoverboard
var baseline = null;
// somewhere near middle of screen ? 
var horizon = null;
// y axis center of screen
var center_axis = null;

function anImage(src) {
  this.img = new Image();
  this.img.src = src;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var within_worldx = function(x) {
  var left_boundary  = (world_x - 50);
  var right_boundary = (world_x + 50);
  if (x < left_boundary || x > right_boundary) {
    return false;
  }
  return true;
};

var within_worldy = function(y) {
  var horizon = (world_y + 50);
  if (y > horizon || y < world_y) {
    return false;
  }
  return true;
};

var clear = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
};

var clearImagesDrawAttr = function(x) {
        images[x].drawHeight = null;
        images[x].drawWidth  = null;
        images[x].drawX      = null;
        images[x].drawY      = null;
};

var render = function() {
  switch (hb_status) {
    case "forward":
      world_y += 1;
      break;
    case "backward":
      world_y -= 1;
      break;
  }

  for (var x=1; x<images.length; x++) {
    if (within_worldx(images[x].x)) {
      if (within_worldy(images[x].y)) {
        // calculate size and position based on distance
        // from world_x and world_y variables
        if (world_y == 0)
          world_y += 1;
        var draw_ratio = (world_y / images[x].y);
        var draw_height =
          (images[x].img.height * draw_ratio);
        var draw_width =
          (images[x].img.width * draw_ratio);
        var draw_x = 
          (center_axis + (images[x].x - world_x));
        var draw_y =
          (horizon + ((baseline - horizon) * draw_ratio));
        images[x].drawHeight = draw_height;
        images[x].drawWidth = draw_width;
        images[x].drawX = draw_x;
        images[x].drawY = draw_y;
      }
      else {
        clearImagesDrawAttr(x);
      }
    }
    else {
        clearImagesDrawAttr(x);
    }
  }
};

var draw = function() {
  context.drawImage(hoverboard.img, hoverboard.x, hoverboard.y);
  for (var x=1; x<images.length; x++) {
    if (images[x].drawHeight && images[x].drawWidth &&
        images[x].drawX && images[x].drawY) {
      context.drawImage(images[x].img,
                        images[x].drawX,
                        images[x].drawY,
                        images[x].drawWidth,
                        images[x].drawHeight);
    }
  }
};

var loop = function() {
  //console.log("debug: loop()");
  requestAnimFrame(loop);
  clear();
  render();
  draw();
};

var initImages = function() {
  //console.log("debug: initImages()");
  hoverboard = new anImage("img/hoverboard_forward.png");
  hoverboard.x = (canvas.width / 2) - (hoverboard.img.width / 2);
  hoverboard.y = (canvas.height / 2) - (hoverboard.img.height / 2);
  images.push(hoverboard);

  baseline = hoverboard.x + hoverboard.img.height;

  tree = new anImage("img/tree.png");
  tree.x = 0;
  tree.y = 40;
  images.push(tree);
};

var init = function() {
	body = document.getElementsByTagName("body")[0];
  body.addEventListener("keydown", key_down, false);
  body.addEventListener("keyup", key_up, false);
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.width = window.innerWidth - 30;
	canvas.height = window.innerHeight - 30;
	context = canvas.getContext('2d');
	body.appendChild(canvas);

  horizon = (canvas.height / 2);
  center_axis = (canvas.width / 2);
  initImages();
};

var start = function() {
  init();
  loop();
};

var key_down = function(e) {
  switch (e.keyCode) {
    case 38:
      hb_status = "forward";
      break;
    case 40:
      hb_status = "backward";
      break;
  }
};

var key_up = function(e) {
  switch (e.keyCode) {
    case 38:
      hb_status = null;
      break;
    case 40:
      hb_status = null;
      break;
  }
};

window.onload = start;
