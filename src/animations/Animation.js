function Animation(scene, span) {

  if (scene == null || span == null || span <= 0) {
    throw new Error('Animation was expecting valid arguments.');
  }

  this.scene = scene;
  this.span = span * 1000;

  this.animationNodes = {};
}

Animation.prototype.update = function(currentUpdateTime) {

  var self = this;

  if (this.previousUpdateTime == null) {
    this.previousUpdateTime = currentUpdateTime;
    this.requestId = requestAnimationFrame(function() {
      self.update(performance.now());
    });
    return;
  }

  var deltaTime = currentUpdateTime - this.previousUpdateTime;

  var disableUpdate = true;
  for (var property in this.animationNodes) {

    animationNode = this.animationNodes[property];
    if (animationNode.done) {
      continue;
    }

    var allDone = this.updateMatrixes(animationNode, deltaTime);

    if (allDone) {
      animationNode.done = true;
      this.resetTimes(animationNode);
    }

    disableUpdate = disableUpdate && allDone;
  }
  this.previousUpdateTime = currentUpdateTime;

  if (disableUpdate) {
    this.requestId = null;
    this.previousUpdateTime = null;
  } else {
    this.requestId = requestAnimationFrame(function() {
      self.update(performance.now());
    });
  }

};

Animation.prototype.buildFunctions = function() {
};

Animation.prototype.run = function(node) {
  this.checkNode(node);
  this.createNodeAnimationIfNotExists(node);
  this.animationNodes[node.id].done = false;
  if (this.requestId == null) {
    this.update();
  }
};

Animation.prototype.isDone = function(node) {
  this.checkNode(node);
  if (this.animationNodes[node.id] == null) {
    return false;
  }
  return this.animationNodes[node.id].done;
};

Animation.prototype.runOnce = function(node) {
  this.checkNode(node);
  var created = this.createNodeAnimationIfNotExists(node);
  if (created) {
    if (this.requestId == null) {
      this.update();
    }
  }
  return this.animationNodes[node.id].done;
};

Animation.prototype.updateMatrixes = function(animationNode, deltaTime) {
  return true;
};

Animation.prototype.getMatrixes = function(node) {
  this.checkNode(node);
  var animationNode = this.animationNodes[node.id];
  if (animationNode !== null) {
    return {
      translate: animationNode.translateMatrix,
      rotateScale: animationNode.rotateScaleMatrix
    };
  }
};

Animation.prototype.setDefaults = function(node) {
  this.animationNodes[node.id] = {};
  var animationNode = this.animationNodes[node.id];
  animationNode.translateMatrix = mat4.create();
  mat4.identity(animationNode.translateMatrix);
  animationNode.rotateScaleMatrix = mat4.create();
  mat4.identity(animationNode.rotateScaleMatrix);
  animationNode.done = false;

  animationNode.currentElapsedTime = 0;
};

Animation.prototype.createNodeAnimationIfNotExists = function(node, setDefault) {

  if (!this.animationNodes.hasOwnProperty(node.id)) {
    if (setDefault === undefined) {
      setDefault = true;
    }
    if (setDefault) {
      this.setDefaults(node);
    }
    return true;
  }
  return false;
};

Animation.prototype.checkNode = function(node) {
  if (node == null || node.id == null) {
    throw new Error('Animation, checkNode must received a node as argument');
  }
};

Animation.prototype.resetTimes = function(animationNode) {
  if (animationNode == null) {
    throw new Error('Animation, resetTimes must received a animationNode as argument.');
  }
};

Animation.prototype.angleBetweenVectors = function(vector1, vector2) {
  if (vector1 == null || vector2 == null || vector1.constructor !== Array || vector2.constructor !== Array || vector1.length !== vector2.length) {
    return;
  }

  var dotProduct = this.dotProduct(vector1, vector2);

  var vector1Norm = this.norm(vector1);
  var vector2Norm = this.norm(vector2);

  return Math.acos(dotProduct / (vector1Norm * vector2Norm));
};

Animation.prototype.dotProduct = function(vector1, vector2) {

  var dotProduct = 0;
  for (var coordinate in vector1) {
    dotProduct += vector1[coordinate] * vector2[coordinate];
  }

  return dotProduct;
};

Animation.prototype.norm = function(vector) {

  var vectorNorm = 0;
  for (var coordinate in vector) {
    vectorNorm += vector[coordinate] * vector[coordinate];
  }

  return Math.sqrt(vectorNorm);
};
