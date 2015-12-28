function Swede(scene, x, y) {
  Pawn.call(this, scene, x, y);
}

Swede.prototype = Object.create(Pawn.prototype);
Swede.prototype.constructor = Swede;
