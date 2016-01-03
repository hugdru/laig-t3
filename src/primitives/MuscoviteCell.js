function MuscoviteCell(scene, x, y) {
  Cell.call(this, scene, x, y);
}

MuscoviteCell.prototype = Object.create(Cell.prototype);
MuscoviteCell.prototype.constructor = MuscoviteCell;

MuscoviteCell.prototype.display = function() {
  this.scene.graph.tablut.muscovitecell.material.apply();
  this.scene.graph.tablut.muscovitecell.texture.bind();

  this.cell.display();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.muscovitecell.texture.unbind();
};
