function ExitCell(scene, x, y) {
  Cell.call(this, scene, x, y);
}

ExitCell.prototype = Object.create(Cell.prototype);
ExitCell.prototype.constructor = ExitCell;

ExitCell.prototype.display = function() {
  this.scene.graph.tablut.exit.material.apply();
  this.scene.graph.tablut.exit.texture.bind();

  this.cell.display();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.exit.texture.unbind();
};
