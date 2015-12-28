function Cell(scene, x, y) {
  NURBSPlane.call(this, scene, 10);

  this.x = x;
  this.y = y;
}

Cell.prototype = Object.create(NURBSPlane.prototype);
Cell.prototype.constructor = Cell;
