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
    stringOfNumbers = this.reader.getString(leafElement, 'args');
    if (stringOfNumbers == null) {
      return 'LEAF, ' + id + ', must have an args attribute.';
    }

    var stringArray = stringOfNumbers.split(/\s+/);

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

        var height = arrayOfNumbers[0];
        var bottomRadius = arrayOfNumbers[1];
        var topRadius = arrayOfNumbers[2];
        var slices = arrayOfNumbers[3];
        var stacks = arrayOfNumbers[4];

        nodes[id] = new Cylinder(scene, height, bottomRadius, topRadius, slices, stacks);
        break;
      case 'sphere':
        arrayOfNumbers = this.getNumbers(stringArray, "f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leafType + ': f i i .';
        }

        var radius = arrayOfNumbers[0];
        var tetaSections = arrayOfNumbers[1];
        var phiSections = arrayOfNumbers[2];

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
      default:
        return 'LEAF, ' + id + ', type attribute only accepts 4 primities: rectangle, cylinder, sphere, triangle.';
    }

  }
};
