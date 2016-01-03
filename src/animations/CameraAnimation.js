function CameraAnimation(camera, span) {

  if (camera == null || span == null) {
    throw new Error('CameraAnimation must have 3 arguments: camera, span.');
  }

  this.camera = camera;
  this.span = span;
  this.angleIncrementor = Math.PI / this.span;

  this.elapsedTime = 0;
}

CameraAnimation.prototype.update = function(deltaTime) {

  var angle = 0;
  this.previousTime = this.elapsedTime;
  this.elapsedTime += deltaTime;

  if (this.elapsedTime >= this.span) {
    angle = this.angleIncrementor * (this.span - this.previousTime);
    this.camera.orbit(CGFcameraAxisID.Y, angle);
    return true;
  }

  angle = this.angleIncrementor * deltaTime;
  this.camera.orbit(CGFcameraAxisID.Y, angle);

  return false;
};
