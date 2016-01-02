function LinearAnimation(piece, target, velocity) {
  if (piece == null || target == null || velocity == null) {
    throw new Error('LinearAnimation must have 3 arguments: piece, target, velocity.');
  }

  var distanceVector = vec3.fromValues(target.x - piece.x, target.y - piece.y, target.z - piece.z);
  var distance = vec3.length(distanceVector);

  this.span = distance / Math.abs(velocity);

  this.velocityVector = vec3.scale(vec3.create(), distanceVector, 1 / this.span);

  this.piece = piece;
  this.target = target;
  this.elapsedTime = 0;
}

LinearAnimation.prototype.update = function(deltaTime) {

  this.elapsedTime += deltaTime;
  if (this.elapsedTime >= this.span) {
    this.piece.x = this.target.x;
    this.piece.y = this.target.y;
    this.piece.z = this.target.z;
    return true;
  }

  this.piece.x = this.piece.x + deltaTime * this.velocityVector[0];
  this.piece.y = this.piece.y + deltaTime * this.velocityVector[1];
  this.piece.z = this.piece.z + deltaTime * this.velocityVector[2];

  return false;
};
