
var Mouse = {};

Mouse.x = 0;
Mouse.y = 0;
Mouse.dtx = 0;
Mouse.dty = 0;
Mouse.lastx = 0;
Mouse.lasty = 0;
Mouse.down = false;

// Pan
Mouse.panX = 0;
Mouse.panY = 0;
Mouse.panStartX = 0;
Mouse.panStartY = 0;
Mouse.panStarted = false;

Mouse.onMove = function(event)
{
  Mouse.x = event.clientX;
  Mouse.y = event.clientY;
  if (Mouse.panStarted)
  {
    Mouse.panX = Mouse.x - Mouse.panStartX;
    Mouse.panY = Mouse.y - Mouse.panStartY;
  }
};

Mouse.update = function () {
  if (Mouse.down) {
    Mouse.dtx += (Mouse.x-Mouse.lastx)/10.;
    Mouse.dty += (Mouse.y-Mouse.lasty)/10.;
  }
  Mouse.dtx *= 0.95;
  Mouse.dty *= 0.95;
  Mouse.lastx = Mouse.x;
  Mouse.lasty = Mouse.y;
}

Mouse.onClic = function(event)
{
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	Mouse.down = true;

  // Pan
  Mouse.panStartX = Mouse.x - Mouse.panX;
  Mouse.panStartY = Mouse.y - Mouse.panY;
  Mouse.panStarted = true;
};

Mouse.onMouseUp = function(event)
{
	Mouse.down = false;
  Mouse.panStarted = false;
};

export default Mouse;
