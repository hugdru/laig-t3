LSXParser.prototype.getRGBA = function(domElement, graphElement) {
  var red = this.reader.getFloat(domElement, 'r');
  if (red === null || isNaN(red) || red < 0 || red > 1)
    return domElement.nodeName + ' must have a r attribute with a numeric value between 0 and 1.';

  var green = this.reader.getFloat(domElement, 'g');
  if (green === null || isNaN(green) || green < 0 || green > 1)
    return domElement.nodeName + ' must have a g attribute with a numeric value between 0 and 1.';

  var blue = this.reader.getFloat(domElement, 'b');
  if (blue === null || isNaN(blue) || blue < 0 || blue > 1)
    return domElement.nodeName + ' must have a b attribute with a numeric value between 0 and 1.';

  var alpha = this.reader.getFloat(domElement, 'a');
  if (alpha === null || isNaN(alpha) || alpha < 0 || alpha > 1)
    return domElement.nodeName + ' must have a a attribute with a numeric value between 0 and 1.';

  graphElement.r = red;
  graphElement.g = green;
  graphElement.b = blue;
  graphElement.a = alpha;
};

LSXParser.prototype.getXYZ = function(domElement, object) {
  return this.getAttributesFloat(domElement, ['x', 'y', 'z'], object);
};

LSXParser.prototype.getSXYZ = function(domElement, object) {
  return this.getAttributesFloat(domElement, ['sx', 'sy', 'sz'], object);
};

LSXParser.prototype.getAttributesFloat = function(domElement, attributesArray, object) {

  if (domElement == null || attributesArray.constructor !== Array || object == null) {
    return 'getAttributesFloat must received: a domElement, an array with the attributes names to parse in order, and an object to hold the properties';
  }

  for (var index = 0; index < attributesArray.length; ++index) {
    var tempVal = this.reader.getFloat(domElement, attributesArray[index]);
    if (tempVal === null || isNaN(tempVal)) {
      return domElement.nodeName + ' must have a ' + attributesArray[index] + ' attribute with a numeric value.';
    }
    if (object.hasOwnProperty(attributesArray[index])) {
      return 'getAttributesFloat: does not accept attributes with the same name';
    } else {
      object[attributesArray[index]] = tempVal;
    }
  }
};

LSXParser.prototype.getNumbers = function(stringOrArrayToParse, selectorString) {
  if (stringOrArrayToParse == null || selectorString == null) {
    return 'expecting a stringToParse and a selectorString';
  }

  var arrayOfStrings;
  switch (stringOrArrayToParse.constructor) {
    case String:
      arrayOfStrings = stringOrArrayToParse.split(/\s+/);
      break;
    case Array:
      arrayOfStrings = stringOrArrayToParse;
      break;
    default:
      return 'getNumbers, expecting a String or Array for 1st argument.';
  }
  var arrayOfSelectors = selectorString.split(/\s+/);

  var length;
  if ((length = arrayOfStrings.length) !== arrayOfSelectors.length) {
    return 'number of space separated string and respective types have different lengths';
  }

  result = [];
  for (var index = 0; index < length; ++index) {
    switch (arrayOfSelectors[index]) {
      case 'i':
        var newInt = parseInt(arrayOfStrings[index].match(/^\d*$/));
        if (isNaN(newInt)) {
          return 'was expecting a int.';
        }
        result.push(newInt);
        break;
      case 'f':
        var newFloat = parseFloat(arrayOfStrings[index]);
        if (isNaN(newFloat)) {
          return 'was expecting a float.';
        }
        result.push(newFloat);
        break;
      default:
        return 'selector not supported';
    }
  }

  return result;
};

var degToRad = Math.PI / 180;

function Rotate(axis, angle) {
  if (axis == null) {
    axis = -1;
    angle = 0;
  }
  if (axis != 'x' && axis != 'y' && axis != 'z') return null;
  this.setAngle(angle);
  this.axis = axis;
}

Rotate.prototype.setAngle = function(angle) {
  if (angle == null) this.angle = 0;
  else this.angle = degToRad * angle;
};

function Translate(x, y, z) {
  if (x != null) this.x = x;
  if (y != null) this.y = y;
  if (z != null) this.z = z;
}

function Scale(sx, sy, sz) {
  if (sx != null) this.sx = sx;
  if (sy != null) this.sy = sy;
  if (sz != null) this.sz = sz;
}
