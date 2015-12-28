function Muscovite(scene, x, y) {
  Pawn.call(this, scene, x, y);
}

Muscovite.prototype = Object.create(Pawn.prototype);
Muscovite.prototype.constructor = Muscovite;

Muscovite.prototype.display = function() {
  this.setTextureAmplification(this.scene.graph.tablut.muscovite.texture.amplifFactor.s, this.scene.graph.tablut.muscovite.texture.amplifFactor.t);

  this.scene.graph.tablut.muscovite.material.apply();
  this.scene.graph.tablut.muscovite.texture.bind();

  this.scene.pushMatrix();
  this.scene.translate(this.x+0.5,0,this.y+0.5);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.cylinder.display();
  this.scene.popMatrix();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.muscovite.texture.unbind();
};
