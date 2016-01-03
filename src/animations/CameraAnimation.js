function CameraAnimation(victim, span) {

  if (victim == null || span == null) {
    throw new Error('CameraAnimation must have 2 arguments: victim and span.');
  }

  this.victim = victim;
  this.span = span;
  this.angleIncrementor = Math.PI / this.span;

  this.elapsedTime = 0;
  this.startAngle = this.victim.angle;
}

CameraAnimation.prototype.update = function(deltaTime) {

  this.elapsedTime += deltaTime;
  if (this.elapsedTime >= this.span) {
    this.victim.angle = this.startAngle + Math.PI;
    return true;
  }

  this.victim.angle = this.startAngle + (this.elapsedTime / this.span) * Math.PI;

  return false;
};
