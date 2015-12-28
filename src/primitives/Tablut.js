function Tablut(scene) {
  CGFobject.call(this, scene);

  this.scene = scene;

  this.mainBoard = new TablutBoard(scene);

  this.pieces = [];

  this.pieces.push(new King(scene,4,4));

  this.pieces.push(new Swede(scene,2,4));
  this.pieces.push(new Swede(scene,3,4));
  this.pieces.push(new Swede(scene,5,4));
  this.pieces.push(new Swede(scene,6,4));
  this.pieces.push(new Swede(scene,4,2));
  this.pieces.push(new Swede(scene,4,3));
  this.pieces.push(new Swede(scene,4,5));
  this.pieces.push(new Swede(scene,4,6));

  this.pieces.push(new Muscovite(scene,3,0));
  this.pieces.push(new Muscovite(scene,4,0));
  this.pieces.push(new Muscovite(scene,5,0));
  this.pieces.push(new Muscovite(scene,4,1));
  this.pieces.push(new Muscovite(scene,3,8));
  this.pieces.push(new Muscovite(scene,4,8));
  this.pieces.push(new Muscovite(scene,5,8));
  this.pieces.push(new Muscovite(scene,4,7));
  this.pieces.push(new Muscovite(scene,0,3));
  this.pieces.push(new Muscovite(scene,0,4));
  this.pieces.push(new Muscovite(scene,0,5));
  this.pieces.push(new Muscovite(scene,1,4));
  this.pieces.push(new Muscovite(scene,8,3));
  this.pieces.push(new Muscovite(scene,8,4));
  this.pieces.push(new Muscovite(scene,8,5));
  this.pieces.push(new Muscovite(scene,7,4));
}

Tablut.prototype = Object.create(CGFobject.prototype);
Tablut.prototype.constructor = Tablut;

Tablut.prototype.display = function() {
	for (i=0; i<this.pieces.length; i++) {
		this.scene.registerForPick(i+1, this.pieces[i]);
		this.pieces[i].display();
	}

  this.mainBoard.display();
};

Tablut.prototype.deletePiece = function(x, y) {
  for (var i=0; i<this.pieces.length; i++) {
    if (this.pieces[i].x === x && this.pieces[i].y === y) {
      this.pieces.splice(i,1);
    }
  }
};

Tablut.prototype.setTextureAmplification = function(amplifS, amplifT) {
  this.cell.setTextureAmplification(amplifS, amplifT);
};
