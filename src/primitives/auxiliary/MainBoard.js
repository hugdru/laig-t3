function MainBoard(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.board = [];

  for (var i=0; i<9; i++) {
    var line = [];
    for (var j=0; j<9; j++) {
      line.push(new Cell(scene, j, i));
    }
    this.board.push(line);
  }

  this.cube = new Cube(this.scene);
}

MainBoard.prototype = Object.create(CGFobject.prototype);
MainBoard.prototype.constructor = MainBoard;

MainBoard.prototype.display = function() {
  this.displayCells();
  this.displayFrame();
};

MainBoard.prototype.displayCells = function() {
  var count = 26;

  this.scene.pushMatrix();

  this.scene.translate(0.5,0,0.5);
  for (var i=0; i<9; i++) {
    for (var j=0; j<9; j++) {
      this.scene.registerForPick(count, this.board[i][j]);
      this.board[i][j].display();
      count++;
      this.scene.translate(1,0,0);
    }
    this.scene.translate(-9,0,1);
  }

  this.scene.clearPickRegistration();

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
