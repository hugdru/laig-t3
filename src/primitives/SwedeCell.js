function SwedeCell(scene, x, y) {
  Cell.call(this, scene, x, y);
}

SwedeCell.prototype = Object.create(Cell.prototype);
SwedeCell.prototype.constructor = SwedeCell;

SwedeCell.prototype.display = function() {
  this.scene.graph.tablut.swedecell.material.apply();
  this.scene.graph.tablut.swedecell.texture.bind();

  this.cell.display();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.swedecell.texture.unbind();
};
