LSXParser.prototype.parseAnimations = function(rootElement) {

  var animationsArray = rootElement.getElementsByTagName('animations');
  if (animationsArray === null || animationsArray.length !== 1) {
    return 'There must be one and only one animations.';
  }

  var animationsElement = animationsArray[0];
  if (animationsElement.attributes.length !== 0) {
    return 'animations, must not have attributes.';
  }

  this.graph.animations = {};
  var animationsObject = this.graph.animations;

  var elementsOfAnimations = animationsElement.children;
  var elementsOfAnimationsLength = elementsOfAnimations.length;

  var startError = "";
  for (var animationElementIndex = 0; animationElementIndex < elementsOfAnimationsLength; ++animationElementIndex) {
    var animationElement = elementsOfAnimations[animationElementIndex];
    animationElementNodeName = animationElement.nodeName;

    if (animationElementNodeName !== 'animation') {
      return 'animations, ' + animationElementNodeName + ' element is not valid.';
    }

    // Get animation attributes
    var id = this.reader.getString(animationElement, 'id');
    if (id == null) {
      return 'missing id.';
    }
    var animationObject = this.parseAnimationsAttributes(animationsObject, animationElement, id);

    startError = 'Animation, ' + id + ', ';
    switch (animationObject.constructor) {
      case LinearAnimation:
        var error = this.parseLinearAnimation(animationObject, animationElement.children);
        if (error !== undefined) {
          return startError + error;
        }
        break;
      case CircularAnimation:
        continue;
      case String:
        return startError + animationObject;
      default:
        return startError + 'unexpected switch default.';
    }
  }

  var allNodes = this.graph.nodes.all;
  for (var nodeId in allNodes) {
    var node = allNodes[nodeId];
    if (node.hasOwnProperty('animations') && node.animations.constructor === Array) {
      for (var animationIndex = 0; animationIndex < node.animations.length; ++animationIndex) {
        var nodeAnimation = node.animations[animationIndex];
        if (!animationsObject.hasOwnProperty(nodeAnimation)) {
          return 'Node with id, ' + nodeId + ', has a non-existent animation, ' + nodeAnimation;
        } else {
          node.animations[animationIndex] = animationsObject[nodeAnimation];
        }
      }
    }
  }

  //delete this.graph.animations;
};

LSXParser.prototype.parseAnimationsAttributes = function(animationsObject, animationElement, id) {
  if (animationsObject == null || animationElement == null) {
    return 'parseAnimationsAttributes, was expecting valid arguments.';
  }

  if (animationsObject.hasOwnProperty(id)) {
    return 'already exists.';
  }

  var span = this.reader.getFloat(animationElement, 'span');
  if (span === null || isNaN(span)) {
    return 'the span value must be a number.';
  }

  var type = this.reader.getString(animationElement, 'type');
  if (type == null) {
    return 'missing type.';
  }

  var animationElementAttributesLength = animationElement.attributes.length;

  var startError;
  switch (type) {
    case 'linear':

      var startOfError = 'type ' + type + ' ';

      if (animationElementAttributesLength !== 3) {
        return startOfError + 'must have exactly 3 attributes.';
      }

      return (animationsObject[id] = new LinearAnimation(this.graph.scene, span));
    case 'circular':

      startOfError = 'type ' + type + ', ';

      if (animationElementAttributesLength !== 7) {
        return startOfError + 'must have exactly 7 attributes.';
      }

      if (animationElement.children.length !== 0) {
        return startOfError + 'must not have children.';
      }

      var center = this.reader.getString(animationElement, 'center');
      if (center == null) {
        return startOfError + 'expecting a center.';
      }

      center = this.getNumbers(center, "f f f");
      if (center.constructor !== Array) {
        return startOfError + 'should have a valid center, "ff ff ff".';
      }
      center = { x: center[0], y: center[1], z: center[2] };

      var radius = this.reader.getFloat(animationElement, 'radius');
      if (radius === null || isNaN(radius)) {
        return startOfError + 'radius value must be a number.';
      }

      var startang = this.reader.getFloat(animationElement, 'startang');
      if (startang === null || isNaN(startang)) {
        return startOfError + 'startang value must be a number.';
      }

      var rotang = this.reader.getFloat(animationElement, 'rotang');
      if (rotang === null || isNaN(rotang)) {
        return startOfError + 'rotang value must be a number.';
      }
      animationsObject[id] = new CircularAnimation(this.graph.scene, span, center, radius, startang, rotang)
      animationsObject[id].buildFunctions();
      return animationsObject[id];
    default:
      return 'animation only supports linear and circular animations.';
  }
};

LSXParser.prototype.parseLinearAnimation = function(animationObject, childrenOfAnimation) {

  if (animationObject == null || childrenOfAnimation == null) {
    return 'parseLinearAnimation expecting valid arguments.';
  }

  childrenOfAnimationLength = childrenOfAnimation.length;
  if (childrenOfAnimationLength < 1) {
    return 'There must be at least 1 control point';
  }

  controlPoints = [];

  for (var index = 0; index < childrenOfAnimationLength; ++index) {
    var controlPointElement = childrenOfAnimation[index];

    controlPointElementName = controlPointElement.nodeName;
    if (controlPointElementName !== 'controlpoint') {
      return 'invalid linear animation child, ' + controlPointElementName;
    }

    if (controlPointElement.attributes.length !== 3) {
      return 'controlpoint must have exactly 3 attributes: xx, yy, zz.';
    }

    obj = {};
    obj.x = this.reader.getFloat(controlPointElement, 'xx');
    if (obj.x === null || isNaN(obj.x)) {
      return 'the xx value of controlpoint must exist and be a number.';
    }
    obj.y = this.reader.getFloat(controlPointElement, 'yy');
    if (obj.y === null || isNaN(obj.y)) {
      return 'the yy value of controlpoint must exist and be a number.';
    }
    obj.z = this.reader.getFloat(controlPointElement, 'zz');
    if (obj.z === null || isNaN(obj.z)) {
      return 'the zz value of controlpoint must exist and be a number.';
    }

    controlPoints.push(obj);
  }

  animationObject.controlPoints = controlPoints;
  animationObject.buildFunctions();
};
