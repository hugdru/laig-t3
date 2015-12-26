function Moscovite(scene, x, y) {
  Pawn.call(this, scene, x, y);
}

Moscovite.prototype = Object.create(Pawn.prototype);
Moscovite.prototype.constructor = Moscovite;
