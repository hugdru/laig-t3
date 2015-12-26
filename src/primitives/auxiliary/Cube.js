function Cube(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;
  this.face  = new NURBSPlane(scene, 10);
}

Cube.prototype = Object.create(CGFobject.prototype);
Cube.prototype.constructor = Cube;

Cube.prototype.display = function() {
  this.scene.pushMatrix();
  this.scene.translate(0,0.5,0);
  this.face.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,-0.5,0);
  this.scene.rotate(Math.PI,0.5,0,0);
  this.face.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,0,0.5);
  this.scene.rotate(Math.PI/2,1,0,0);
  this.face.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,0,-0.5);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.face.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(-0.5,0,0);
  this.scene.rotate(Math.PI/2,0,0,1);
  this.face.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0.5,0,0);
  this.scene.rotate(-Math.PI/2,0,0,1);
  this.face.display();
  this.scene.popMatrix();
};

Cube.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
