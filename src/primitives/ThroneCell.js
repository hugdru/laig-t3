function ThroneCell(scene, x, y) {
  Cell.call(this, scene, x, y);
}

ThroneCell.prototype = Object.create(Cell.prototype);
ThroneCell.prototype.constructor = ThroneCell;

ThroneCell.prototype.display = function() {
  this.scene.graph.tablut.throne.material.apply();
  this.scene.graph.tablut.throne.texture.bind();

  this.cell.display();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.throne.texture.unbind();
};
