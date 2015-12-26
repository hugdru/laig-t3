function Rectangle(scene, v1, v2) {
  CGFobject.call(this, scene);

  this.plane = new Plane(scene, 2, v1, v2);
}

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.display = function() {
  this.plane.display();
};

Rectangle.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.plane.setTextureAmplification(amplifS, amplifT);
}
