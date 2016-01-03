function Cell(scene, x, y) {
  CGFobject.call(this, scene);

  this.cell = new NURBSPlane(scene, 10);

  this.x = x;
  this.y = y;
  this.z = 0;
}

Cell.prototype = Object.create(CGFobject.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.display = function() {
  this.scene.graph.tablut.cells.material.apply();
  this.scene.graph.tablut.cells.texture.bind();

  this.cell.display();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.cells.texture.unbind();
};
