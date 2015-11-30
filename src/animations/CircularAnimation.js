var degToRad = Math.PI / 180;

function CircularAnimation(scene, span, center, radius, startdegree, rotationDegree) {

  Animation.call(this, scene, span);

  if (center == null ||
      radius == null || radius <= 0 ||
      startdegree == null || rotationDegree == null
     ) {
    throw new Error('CircularAnimation expecting valid arguments');
  }

  this.center = center;
  this.radius = radius;
  this.startAngle = degToRad * startdegree;
  this.rotationAngle = degToRad * rotationDegree;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.buildFunctions = function() {
};

CircularAnimation.prototype.updateMatrixes = function(animationNode, deltaTime) {
  if (animationNode == null || deltaTime == null || deltaTime < 0) {
      throw new Error('updateMatrixes, was expecting a animationNode and a valid deltaTime.');
  }

  animationNode.currentElapsedTime += deltaTime;
  animationNode.currentElapsedTime = Math.min(animationNode.currentElapsedTime, this.span);

  var rotateAngle = this.startAngle + this.rotationAngle * (animationNode.currentElapsedTime / this.span);

  mat4.identity(animationNode.translateMatrix);
  mat4.translate(animationNode.translateMatrix, animationNode.translateMatrix,
                 vec3.fromValues(this.radius * Math.cos(rotateAngle) + this.center.x, this.center.y, -this.radius * Math.sin(rotateAngle) + this.center.z)
                );

  mat4.identity(animationNode.rotateScaleMatrix);
  mat4.rotateY(animationNode.rotateScaleMatrix, animationNode.rotateScaleMatrix, rotateAngle);

  if (animationNode.currentElapsedTime >= this.span) {
    return true;
  }
};

CircularAnimation.prototype.resetTimes = function(animationNode) {

  Animation.prototype.resetTimes.call(this, animationNode);

  animationNode.currentElapsedTime = 0;
};
