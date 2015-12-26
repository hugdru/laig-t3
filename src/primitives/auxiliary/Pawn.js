function Pawn(scene, x, y) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.x = x;
  this.y = y;

  this.cylinder = new Cylinder(scene, 0.3, 0.3, 0.3, 10, 10);
}

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor = Pawn;

Pawn.prototype.display = function() {
  this.scene.pushMatrix();
  this.scene.translate(this.x+0.5,0,this.y+0.5);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.cylinder.display();
  this.scene.popMatrix();
};

Pawn.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
