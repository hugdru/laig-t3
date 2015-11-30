LSXParser.prototype.parseLeaves = function(rootElement) {

  var leavesArray = rootElement.getElementsByTagName('LEAVES');
  if (leavesArray === null || leavesArray.length !== 1) {
    return 'There must be 1 and only 1 LEAVES.';
  }

  var leavesElement = leavesArray[0];

  if (leavesElement.attributes.length !== 0) {
    return 'LEAVES, must not have attributes.';
  }

  this.graph.nodes = {};
  this.graph.nodes.all = {};
  var nodes = this.graph.nodes.all;

  var error;

  var leafElements = leavesElement.children;
  var leafElementsLength = leafElements.length;
  if (leafElementsLength < 1) {
    return 'LEAVES, there must be at least one LEAF.';
  }
  for (var leafElementIndex = 0; leafElementIndex < leafElementsLength; ++leafElementIndex) {
    var leafElement = leafElements[leafElementIndex];
    if (leafElement.nodeName !== 'LEAF') {
      return 'LEAVES, ' + leafElement.nodeName + ' element is not valid.';
    }

    // Get LEAF id
    var id = this.reader.getString(leafElement, 'id');
    if (id == null) {
      return 'LEAF, invalid ID.';
    }

    if (nodes.hasOwnProperty(id)) {
      return 'LEAF, ' + id + ', already exists';
    }

    nodes[id] = {};

    // Get LEAF type
    var leafType = this.reader.getString(leafElement, 'type');

    if (leafType == null) {
      return 'LEAF, ' + id + ', must have a type attribute with a string value.';
    }

    // Get the args
    var stringOfNumbers = null;
    if (leafType !== 'plane' && leafType !== 'patch' && leafType !== 'terrain' && leafType !== 'vehicle') {
     stringOfNumbers = this.reader.getString(leafElement, 'args');
    }
    if (stringOfNumbers == null && leafType !== 'plane' && leafType !== 'patch' && leafType !== 'terrain' && leafType !== 'vehicle') {
      return 'LEAF, ' + id + ', must have an args attribute.';
    }

    var stringArray = [];
    if (stringOfNumbers != null) {
      stringArray = stringOfNumbers.split(/\s+/);
    }

    var scene = this.graph.scene;

    var v1, v2;

    switch (leafType) {
      case 'rectangle':
        var arrayOfNumbers = this.getNumbers(stringArray, "f f f f");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leafType + ': f f f f .';
        }

        v1 = [arrayOfNumbers[0], arrayOfNumbers[1]];
        v2 = [arrayOfNumbers[2], arrayOfNumbers[3]];

        nodes[id] = new Rectangle(scene, v1, v2);
        break;
      case 'cylinder':
        arrayOfNumbers = this.getNumbers(stringArray, "f f f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leafType + ': f f f i i .';
        }

        var height       = arrayOfNumbers[0];
        var bottomRadius = arrayOfNumbers[1];
        var topRadius    = arrayOfNumbers[2];
        var slices       = arrayOfNumbers[3];
        var stacks       = arrayOfNumbers[4];

        nodes[id] = new Cylinder(scene, height, bottomRadius, topRadius, slices, stacks);
        break;
      case 'sphere':
        arrayOfNumbers = this.getNumbers(stringArray, "f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leafType + ': f i i .';
        }

        var radius       = arrayOfNumbers[0];
        var tetaSections = arrayOfNumbers[1];
        var phiSections  = arrayOfNumbers[2];

        nodes[id] = new Sphere(scene, radius, tetaSections, phiSections);
        break;
      case 'triangle':
        arrayOfNumbers = this.getNumbers(stringArray, "f f f f f f f f f");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leafType + ': f f f f f f f f f .';
        }

        v1 = [arrayOfNumbers[0], arrayOfNumbers[1], arrayOfNumbers[2]];
        v2 = [arrayOfNumbers[3], arrayOfNumbers[4], arrayOfNumbers[5]];
        v3 = [arrayOfNumbers[6], arrayOfNumbers[7], arrayOfNumbers[8]];

        nodes[id] = new Triangle(scene, v1, v2, v3);
        break;
      case 'plane':
        var parts = this.reader.getInteger(leafElement, 'parts');

        if (parts == null) {
          return 'LEAF, ' + id + ', must have a parts attribute with a integer value.';
        }

        if (parts <= 0) {
          return 'LEAF, ' + id + ', parts attribute must be greater or equal 1.';
        }

        nodes[id] = new NURBSPlane(scene, parts);
        break;
      case 'patch':
        var order = this.reader.getInteger(leafElement, 'order');
        var partsU = this.reader.getInteger(leafElement, 'partsU');
        var partsV = this.reader.getInteger(leafElement, 'partsV');
        var controlPoints = [];

        if (order == null) {
          return 'LEAF, ' + id + ', must have an order attribute with a integer value.';
        }

        if (order < 1 && order > 3) {
          return 'LEAF, ' + id + ', order attribute must be between 1 and 3.';
        }

        if (partsU == null) {
          return 'LEAF, ' + id + ', must have a partsU attribute with a integer value.';
        }

        if (partsU <= 0) {
          return 'LEAF, ' + id + ', partsU attribute must be greater or equal 1.';
        }

        if (partsV == null) {
          return 'LEAF, ' + id + ', must have a partsV attribute with a integer value.';
        }

        if (partsV <= 0) {
          return 'LEAF, ' + id + ', partsV attribute must be greater or equal 1.';
        }

        var controlPointsElement = leafElement.getElementsByTagName('controlpoint');

        if (controlPointsElement.length !== Math.pow(order+1,2)) {
          return 'LEAF, ' + id + ', must have (order+1)^2 control points.';
        }

        for(var i = 0; i < controlPointsElement.length; i++) {
          var controlPointElement = controlPointsElement[i];

          if (controlPointElement.attributes.length != 3) {
            return 'controlpoint, there must be exactly 3 elements: x, y and z.';
          }

          var controlPoint = [];

          var x = this.reader.getFloat(controlPointElement, 'x');
          var y = this.reader.getFloat(controlPointElement, 'y');
          var z = this.reader.getFloat(controlPointElement, 'z');

          controlPoint.push(x);
          controlPoint.push(y);
          controlPoint.push(z);
          controlPoint.push(1);

          controlPoints.push(controlPoint);
        }

        nodes[id] = new NURBSPatch(scene, order, partsU, partsV, controlPoints);
        break;
      case 'terrain':
        var texture = this.reader.getString(leafElement, 'texture');
        var heightMap = this.reader.getString(leafElement, 'heightmap');

        nodes[id] = new Terrain(scene, texture, heightMap);
        break;
      case 'vehicle':
        nodes[id] = new Vehicle(scene);
        break;
      default:
        return 'LEAF, ' + id + ', type attribute only accepts 4 primities: rectangle, cylinder, sphere, triangle.';
    }

  }
};
