function TablutBoard(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.board = [];

  //for (var i=0; i<9; i++) {
    //var line = [];
    //for (var j=0; j<9; j++) {
      //line.push(new Cell(scene, j, i));
    //}
    //this.board.push(line);
  //}
  this.board.push([new ExitCell(scene,0,0), new Cell(scene,1,0), new Cell(scene,2,0), new MuscoviteCell(scene,3,0), new MuscoviteCell(scene,4,0), new MuscoviteCell(scene,5,0), new Cell(scene,6,0), new Cell(scene,7,0), new ExitCell(scene,8,0)]);
  this.board.push([new Cell(scene,0,1), new Cell(scene,1,1), new Cell(scene,2,1), new Cell(scene,3,1), new MuscoviteCell(scene,4,1), new Cell(scene,5,1), new Cell(scene,6,1), new Cell(scene,7,1), new Cell(scene,8,1)]);
  this.board.push([new Cell(scene,0,2), new Cell(scene,1,2), new Cell(scene,2,2), new Cell(scene,3,2), new SwedeCell(scene,4,2), new Cell(scene,5,2), new Cell(scene,6,2), new Cell(scene,7,2), new Cell(scene,8,2)]);
  this.board.push([new MuscoviteCell(scene,0,3), new Cell(scene,1,3), new Cell(scene,2,3), new Cell(scene,3,3), new SwedeCell(scene,4,3), new Cell(scene,5,3), new Cell(scene,6,3), new Cell(scene,7,3), new MuscoviteCell(scene,8,3)]);
  this.board.push([new MuscoviteCell(scene,0,4), new MuscoviteCell(scene,1,4), new SwedeCell(scene,2,4), new SwedeCell(scene,3,4), new ThroneCell(scene,4,4), new SwedeCell(scene,5,4), new SwedeCell(scene,6,4), new MuscoviteCell(scene,7,4), new MuscoviteCell(scene,8,4)]);
  this.board.push([new MuscoviteCell(scene,0,5), new Cell(scene,1,5), new Cell(scene,2,5), new Cell(scene,3,5), new SwedeCell(scene,4,5), new Cell(scene,5,5), new Cell(scene,6,5), new Cell(scene,7,5), new MuscoviteCell(scene,8,5)]);
  this.board.push([new Cell(scene,0,6), new Cell(scene,1,6), new Cell(scene,2,6), new Cell(scene,3,6), new SwedeCell(scene,4,6), new Cell(scene,5,6), new Cell(scene,6,6), new Cell(scene,7,6), new Cell(scene,8,6)]);
  this.board.push([new Cell(scene,0,7), new Cell(scene,1,7), new Cell(scene,2,7), new Cell(scene,3,7), new MuscoviteCell(scene,4,7), new Cell(scene,5,7), new Cell(scene,6,7), new Cell(scene,7,7), new Cell(scene,8,7)]);
  this.board.push([new ExitCell(scene,0,8), new Cell(scene,1,8), new Cell(scene,2,8), new MuscoviteCell(scene,3,8), new MuscoviteCell(scene,4,8), new MuscoviteCell(scene,5,8), new Cell(scene,6,8), new Cell(scene,7,8), new ExitCell(scene,8,8)]);

  this.cube = new Cube(this.scene);
}

TablutBoard.prototype = Object.create(CGFobject.prototype);
TablutBoard.prototype.constructor = TablutBoard;

TablutBoard.prototype.display = function() {
  this.displayCells();
  this.displayFrame();
};

TablutBoard.prototype.displayCells = function() {
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

TablutBoard.prototype.displayFrame = function() {
  this.scene.graph.tablut.frame.material.apply();
  this.scene.graph.tablut.frame.texture.bind();

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

  this.scene.setDefaultAppearance();
  this.scene.graph.tablut.frame.texture.unbind();
};

TablutBoard.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
