function Cylinder(scene, height, bottomRadius, topRadius, slices, stacks) {
  CGFobject.call(this, scene);
  this.lateralFaces = new LateralFaces(scene, height, bottomRadius, topRadius, slices, stacks);
  this.base = new Base(scene, slices);

  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {
  this.lateralFaces.display();

  this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.scene.scale(this.topRadius, this.topRadius, 0);
    this.base.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI, -1, 0, 0);
    this.scene.scale(this.bottomRadius, this.bottomRadius, 0);
    this.base.display();
  this.scene.popMatrix();
};

Cylinder.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.lateralFaces.setTextureAmplification(amplifS, amplifT);
  this.base.setTextureAmplification(amplifS, amplifT);
};
