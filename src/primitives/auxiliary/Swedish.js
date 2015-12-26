function Swedish(scene, x, y) {
  Pawn.call(this, scene, x, y);
}

Swedish.prototype = Object.create(Pawn.prototype);
Swedish.prototype.constructor = Swedish;
