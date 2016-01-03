function Cemetery(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.board = [];

  this.board.push([new Cell(scene, -2, 0), new Cell(scene, -3, 0)]);
  this.board.push([new Cell(scene, -2, 1), new Cell(scene, -3, 1)]);
  this.board.push([new Cell(scene, -2, 2), new Cell(scene, -3, 2)]);
  this.board.push([new Cell(scene, -2, 3), new Cell(scene, -3, 3)]);
  this.board.push([new Cell(scene, -2, 4), new Cell(scene, -3, 4)]);
  this.board.push([new Cell(scene, -2, 5), new Cell(scene, -3, 5)]);
  this.board.push([new Cell(scene, -2, 6), new Cell(scene, -3, 6)]);
  this.board.push([new Cell(scene, -2, 7), new Cell(scene, -3, 7)]);

  this.board.push([new Cell(scene, -2, 8), new Cell(scene, -3, 8)], new Cell(scene, -4, 8), new Cell(scene, -5, 8));
  this.board.push([new Cell(scene, -2, 9), new Cell(scene, -3, 9)], new Cell(scene, -4, 9), new Cell(scene, -5, 8));
}

Cemetery.prototype = Object.create(CGFobject.prototype);
Cemetery.prototype.constructor = Cemetery;

Cemetery.prototype.display = function() {
  this.displayCells();
};

Cemetery.prototype.displayCells = function() {
  this.scene.pushMatrix();

  var count = 1000;
  this.scene.translate(0.5, 0, 0.5);
  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board[i].length; j++) {
      this.scene.registerForPick(count, this.board[i][j]);
      this.board[i][j].display();
      count++;
      this.scene.translate(1, 0, 0);
    }
    this.scene.translate(-9, 0, 1);
  }

  this.scene.clearPickRegistration();
  this.scene.popMatrix();
};

Cemetery.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
