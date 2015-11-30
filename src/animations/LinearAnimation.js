function LinearAnimation(scene, span) {
  Animation.call(this, scene, span);

  this.percentageStageTimeRotation = 0.20;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.buildFunctions = function() {

  if (this.controlPoints[0].x !== 0 || this.controlPoints[0].y !== 0 || this.controlPoints[0].z !== 0) {
    this.controlPoints.splice(0, 0, {x:0, y:0, z:0});
  }

  this.stageLength = this.controlPoints.length - 1;
  if (this.stageLength < 0) {
    throw new Error('LinearAnimation, was expecting at least one controlPoint.');
  }

  var distance = 0;
  this.translationVectors = [];
  for (var stageIndex = 0; stageIndex < this.stageLength; ++stageIndex) {
    var vector = {};
    vector.x = this.controlPoints[stageIndex + 1].x - this.controlPoints[stageIndex].x;
    vector.y = this.controlPoints[stageIndex + 1].y - this.controlPoints[stageIndex].y;
    vector.z = this.controlPoints[stageIndex + 1].z - this.controlPoints[stageIndex].z;
    this.translationVectors.push(vector);

    distance += this.norm(vector);
  }

  var velocity = distance / this.span;

  this.rotations = {};
  this.rotations[0] = 0;
  this.controlPointsTimes = {};
  this.controlPointsTimes[0] = 0;
  this.controlPointsTimesDelta = {};

  for (var index = 1; index < this.stageLength; ++index) {
    var timeStage = this.norm(this.translationVectors[index - 1]) / velocity;
    this.controlPointsTimes[index] = this.controlPointsTimes[index - 1] + timeStage;
    this.controlPointsTimesDelta[index - 1] = this.controlPointsTimes[index] - this.controlPointsTimes[index - 1];

    var rotationStage = Math.atan2(this.translationVectors[index].x, this.translationVectors[index].z) - Math.atan2(this.translationVectors[index - 1].x, this.translationVectors[index - 1].z);
    if (Math.abs(rotationStage) > Math.PI) {
      if (rotationStage > 0) {
        rotationStage -= 2 * Math.PI;
      } else {
        rotationStage += 2 * Math.PI;
      }
    }

    this.rotations[index] = this.rotations[index - 1] + rotationStage;

    if (isNaN(this.rotations[index])) {
      this.rotations[index] = this.rotations[index - 1];
    }
  }

  this.controlPointsTimesDelta[index - 1] = this.span - this.controlPointsTimes[index - 1];
};

LinearAnimation.prototype.updateMatrixes = function(animationNode, deltaTime) {
  if (animationNode == null || deltaTime == null || deltaTime < 0) {
      throw new Error('updateMatrixes, was expecting a animationNode and a valid deltaTime.');
  }

  animationNode.currentElapsedTime += deltaTime;
  animationNode.currentElapsedTime = Math.min(animationNode.currentElapsedTime, this.span);

  for (var currentStageIndex = (this.stageLength - 1); currentStageIndex > 0; --currentStageIndex) {
    if (this.controlPointsTimes[currentStageIndex] < animationNode.currentElapsedTime) {
      break;
    }
  }

  mat4.identity(animationNode.translateMatrix);
  mat4.identity(animationNode.rotateScaleMatrix);

  /** Translation **/
  var translateRatio = (animationNode.currentElapsedTime - this.controlPointsTimes[currentStageIndex]) / this.controlPointsTimesDelta[currentStageIndex];

  mat4.translate(animationNode.translateMatrix, animationNode.translateMatrix,
    vec3.fromValues(
      this.controlPoints[currentStageIndex].x + this.translationVectors[currentStageIndex].x * translateRatio,
      this.controlPoints[currentStageIndex].y + this.translationVectors[currentStageIndex].y * translateRatio,
      this.controlPoints[currentStageIndex].z + this.translationVectors[currentStageIndex].z * translateRatio
    )
  );
  /** End of Translation **/

  /** Rotation **/
  if (currentStageIndex !== (this.stageLength - 1)) {
    var rotateTimeDelta = this.controlPointsTimes[currentStageIndex + 1] - animationNode.currentElapsedTime;
    var intervalToRotate = this.percentageStageTimeRotation * this.controlPointsTimesDelta[currentStageIndex];
    if (rotateTimeDelta < intervalToRotate) {
      var rotationDelta = this.rotations[currentStageIndex + 1] - this.rotations[currentStageIndex];
      var rotateRatio = (intervalToRotate - rotateTimeDelta) / intervalToRotate;
      mat4.rotateY(animationNode.rotateScaleMatrix, animationNode.rotateScaleMatrix, this.rotations[currentStageIndex] + rotationDelta * rotateRatio);
    } else {
      mat4.rotateY(animationNode.rotateScaleMatrix, animationNode.rotateScaleMatrix, this.rotations[currentStageIndex]);
    }
  } else {
      mat4.rotateY(animationNode.rotateScaleMatrix, animationNode.rotateScaleMatrix, this.rotations[currentStageIndex]);
  }
  /** End of Rotation **/

  if (animationNode.currentElapsedTime >= this.span) {
    return true;
  }
};

LinearAnimation.prototype.resetTimes = function(animationNode) {

  Animation.prototype.resetTimes.call(this, animationNode);

  animationNode.currentElapsedTime = 0;
};
