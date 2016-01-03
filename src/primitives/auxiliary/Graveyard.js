function Graveyard(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.nextX = 0;
  this.nextY = 0;

  this.cell = new Cell(scene,-1,-1);
  this.cube = new Cube(this.scene);
}

Graveyard.prototype = Object.create(CGFobject.prototype);
Graveyard.prototype.constructor = Graveyard;

Graveyard.prototype.display = function() {
  this.displayCells();
  this.displayFrame();
};

Graveyard.prototype.displayCells = function() {
  this.scene.pushMatrix();

  this.scene.translate(-1.5, 0, 3.5);
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 4; j++) {
      this.cell.display();
      this.scene.translate(-1, 0, 0);
    }
    this.scene.translate(4, 0, 1);
  }

  this.scene.popMatrix();
};

Graveyard.prototype.displayFrame = function() {
  this.scene.graph.tablut.frame.material.apply();
  this.scene.graph.tablut.frame.texture.bind();

  this.scene.pushMatrix();
  this.scene.translate(-3, 0.0625, 2.875);
  this.scene.scale(4, 0.125, 0.25);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(-3, 0.0625, 9.125);
  this.scene.scale(4, 0.125, 0.25);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(-0.875, 0.0625, 6);
  this.scene.scale(0.25, 0.125, 6.5);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(-5.125, 0.0625, 6);
  this.scene.scale(0.25, 0.125, 6.5);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.frame.texture.unbind();
};

Graveyard.prototype.getTomb = function() {
  var position = {};
  position.x = this.nextX-2;
  position.y = this.nextY+3;
  position.z = 0;

  if (this.nextX === -3) {
    this.nextX = 0;
    this.nextY = this.nextY+1;
  }
  else
    this.nextX = this.nextX-1;

  return position;
};

Graveyard.prototype.undo = function() {
  if (this.nextX === 0) {
    this.nextX = -3;
    this.nextY = this.nextY-1;
  }
  else
    this.nextX = this.nextX+1;
};

Graveyard.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
