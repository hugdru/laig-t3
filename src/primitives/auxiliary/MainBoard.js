function MainBoard(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.cell = new NURBSPlane(scene, 10);
  this.cube = new Cube(this.scene);
}

MainBoard.prototype = Object.create(CGFobject.prototype);
MainBoard.prototype.constructor = MainBoard;

MainBoard.prototype.display = function() {
  this.displayCells();
  this.displayFrame();
};

MainBoard.prototype.displayCells = function() {
  this.scene.pushMatrix();

  this.scene.translate(0.5,0,0.5);
  for (var i=0; i<9; i++) {
    this.scene.translate(0,0,9);
    for (var j=0; j<9; j++) {
      this.scene.translate(0,0,-1);
      this.cell.display();
    }
    this.scene.translate(1,0,0);
  }

  this.scene.popMatrix();
};

MainBoard.prototype.displayFrame = function() {
  this.scene.pushMatrix();
  this.scene.translate(4.5,0.0625,-0.125);
  this.scene.scale(9,0.125,0.25);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(4.5,0.0625,9.125);
  this.scene.scale(9,0.125,0.25);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(-0.125,0.0625,4.5);
  this.scene.scale(0.25,0.125,9.5);
  this.cube.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(9.125,0.0625,4.5);
  this.scene.scale(0.25,0.125,9.5);
  this.cube.display();
  this.scene.popMatrix();
};

MainBoard.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
