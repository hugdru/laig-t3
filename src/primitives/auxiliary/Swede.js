function Swede(scene, x, y) {
  Pawn.call(this, scene, x, y);
}

Swede.prototype = Object.create(Pawn.prototype);
Swede.prototype.constructor = Swede;

Swede.prototype.display = function() {
  this.scene.graph.tablut.swede.material.apply();
  this.scene.graph.tablut.swede.texture.bind();

  this.scene.pushMatrix();
  this.scene.translate(this.x+0.5,0,this.y+0.5);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.cylinder.display();
  this.scene.popMatrix();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.swede.texture.unbind();
};
