LSXParser.prototype.parseNodes = function(rootElement) {

  var nodesArray = rootElement.getElementsByTagName('NODES');
  if (nodesArray === null || nodesArray.length !== 1) {
    return 'There must be one and only one NODES.';
  }

  var nodesElement = nodesArray[0];

  if (nodesElement.attributes.length !== 0) {
    return 'NODES, must not have attributes.';
  }

  if (!(this.graph.hasOwnProperty('nodes') && this.graph.nodes.hasOwnProperty('all'))) {
    return 'NODES, nodes.all property should already be defined.';
  }

  var nodesObject = this.graph.nodes;
  var allNodesObject = nodesObject.all;
  var numberOfNodes = 0;

  var error = this.parseNodesRoot(nodesObject, nodesElement.getElementsByTagName('ROOT'));
  if (error !== undefined) {
    return 'NODES, ' + error;
  }

  var elementsOfNodes = nodesElement.children;
  for (var nodeElementIndex = 0; nodeElementIndex < elementsOfNodes.length; ++nodeElementIndex) {
    var nodeElement = elementsOfNodes[nodeElementIndex];
    if (nodeElement.nodeName == 'ROOT') {
      continue;
    } else if (nodeElement.nodeName !== 'NODE') {
      return 'NODES, ' + nodeElement.nodeName + ' element is not valid.';
    }

    if (nodeElement.attributes.length != 1) {
      return 'NODE, must have 1 and only 1 attribute, id.';
    }

    // Get NODE id
    var id = this.reader.getString(nodeElement, 'id');
    if (id == null) {
      return 'Node, invalid ID.';
    }

    if (allNodesObject.hasOwnProperty(id)) {
      return 'Node, ' + id + ', already exists.';
    }

    allNodesObject[id] = {};
    nodeObject = allNodesObject[id];
    nodeObject.id = numberOfNodes;
    ++numberOfNodes;

    var nodeElementChildren = nodeElement.children;
    var nodeElementChildrenLength = nodeElementChildren.length;

    if (nodeElementChildrenLength < 3) {
      return 'Node, ' + id + ', there must be at least 3 elements: MATERIAL, TEXTURE, DESCENDANTS';
    }

    var minimumElementCount = 0;
    for (var index = 0; index < nodeElementChildrenLength; ++index) {
      var elementOfNode = nodeElementChildren[index];
      switch (elementOfNode.nodeName) {
        case 'MATERIAL':
          if (nodeObject.hasOwnProperty('material')) {
            return 'NODE, ' + id + ', there can only be one MATERIAL.';
          }
          error = this.parseNodesMaterial(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          ++minimumElementCount;
          break;
        case 'TEXTURE':
          if (nodeObject.hasOwnProperty('texture')) {
            return 'NODE, ' + id + ', there can only be one TEXTURE.';
          }
          error = this.parseNodesTexture(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          ++minimumElementCount;
          break;
        case 'animationref':
          nodeObject.animations = nodeObject.animations || [];
          error = this.parseNodesAnimation(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          break;
        case 'DESCENDANTS':
          if (nodeObject.hasOwnProperty('descendants')) {
            return 'NODE, ' + id + ', there can only be one DESCENDANTS.';
          }
          nodeObject.descendants = {};
          error = this.parseNodesDescendants(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          ++minimumElementCount;
          break;
        case 'TRANSLATION':
          error = this.parseNodesTranslation(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          break;
        case 'ROTATION':
          error = this.parseNodesRotation(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          break;
        case 'SCALE':
          error = this.parseNodesScale(nodeObject, elementOfNode);
          if (error !== undefined) {
            return 'NODE, ' + id + ', ' + error;
          }
          break;
        default:
          return 'NODE, ' + id + ', ' + nodeElementChildren[index].nodeName + ' is not a valid element.';
      }
    }
    if (minimumElementCount !== 3) {
      return 'NODE, ' + id + ', must have 1 and only 1 element of: MATERIAL, TEXTURE, and DESCENDANTS.';
    }
  }

  // Check if ids in descendants really exist and convert them to "pointers"
  for (var nodeId in allNodesObject) {
    var nodeObjectDescendants = allNodesObject[nodeId].descendants;
    for (var descendantId in nodeObjectDescendants) {
      if (allNodesObject.hasOwnProperty(descendantId)) {
        nodeObjectDescendants[descendantId] = allNodesObject[descendantId];
      } else {
        return 'NODE, ' + nodeId + ', has an unexisting node as descendant, ' + descendantId + '.';
      }
    }
  }

  if (allNodesObject.hasOwnProperty(nodesObject.root)) {
    nodesObject.root = allNodesObject[nodesObject.root];
  } else {
    return 'ROOT NODE is missing, create a NODE with id, ' + nodesObject.root;
  }

};

LSXParser.prototype.parseNodesRoot = function(nodesObject, rootArray) {

  if (nodesObject == null || rootArray == null || rootArray.length !== 1) {
    return 'there must be 1 and only 1 ROOT.';
  }

  var rootElement = rootArray[0];

  if (rootElement.attributes.length !== 1) {
    return 'ROOT element must have exactly 1 attribute: id.';
  }

  nodesObject.root = this.reader.getString(rootElement, 'id');
  if (nodesObject.root == null) {
    return 'invalid id attribute for ROOT, must be a string.';
  }

  if (nodesObject.all.hasOwnProperty(nodesObject.root)) {
    return 'ROOT cannot be a leaf.';
  }

};

LSXParser.prototype.parseNodesMaterial = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 1) {
    return 'MATERIAL can only have 1 attribute, id';
  }

  var materialId = this.reader.getString(elementOfNode, 'id');
  if (materialId == null || (materialId != 'null' && !this.graph.materials.hasOwnProperty(materialId))) {
    return 'MATERIAL of NODE must have an id attribute with a string value, and the material must exist or be null';
  }

  if (materialId != 'null') {
    nodeObject.material = this.graph.materials[materialId];
  } else {
    nodeObject.material = materialId;
  }
};

LSXParser.prototype.parseNodesTexture = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 1) {
    return 'TEXTURE can only have 1 attribute, id';
  }

  var textureId = this.reader.getString(elementOfNode, 'id');
  if (textureId == null || (textureId != 'null' && textureId != 'clear' && !this.graph.textures.hasOwnProperty(textureId))) {
    return 'TEXTURE of NODE must have an id attribute with a string value, and the material must exist, be null, or clear';
  }

  if (textureId == 'null' || textureId == 'clear') {
    nodeObject.texture = textureId;
  } else {
    nodeObject.texture = this.graph.textures[textureId];
  }
};

LSXParser.prototype.parseNodesDescendants = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting: a nodeObject, a elementOfNode, and a arrayOfUnsolvedDescendantIds.';
  }

  var elementOfNodeChildren = elementOfNode.children;
  var elementOfNodeChildrenLength = elementOfNodeChildren.length;

  if (elementOfNodeChildrenLength < 1) {
    return 'there must be at least one DESCENDANT IN DESCENDANTS';
  }

  for (var index = 0; index < elementOfNodeChildrenLength; ++index) {
    var child = elementOfNodeChildren[index];
    if (child.nodeName !== 'DESCENDANT') {
      return child.nodeName + ' is not valid under DESCENDANTS.';
    }

    if (child.attributes.length != 1) {
      return child.nodeName + ' only supports one attribute, id.';
    }

    // Cannot check if respective node with that id exists cause it might not be created yet
    var idDescendant = this.reader.getString(child, 'id');
    if (idDescendant == null) {
      return 'Invalid ID for DESCENDANT.';
    }

    if (nodeObject.descendants.hasOwnProperty(idDescendant)) {
      return 'descendant with same id, ' + idDescendant + ', in DESCENDANTS.';
    } else {
      nodeObject.descendants[idDescendant] = null;
    }
  }

};

LSXParser.prototype.parseNodesTranslation = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  var coordinates = 'xyz';

  if (elementOfNode.attributes.length != 3) {
    return 'TRANSLATE can only have 3 attributes: x, y, z.';
  }

  translate = new Translate();
  var error = this.getXYZ(elementOfNode, translate);
  if (error != null) {
    return error;
  }

  nodeObject.transformations = nodeObject.transformations || [];
  nodeObject.transformations.push(translate);
};

LSXParser.prototype.parseNodesRotation = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 2) {
    return 'ROTATION can only have 2 attributes: angle and axis.';
  }

  var coordinates = 'xyz';

  var coordinate = this.reader.getString(elementOfNode, 'axis');
  var coordinateIndex = coordinates.indexOf(coordinate);
  if (coordinateIndex === -1) return 'the axis attribute must be either: x, y or z.';

  var degrees = this.reader.getFloat(elementOfNode, 'angle');
  if (degrees === null || isNaN(degrees)) {
    return 'the angle value must be a number.';
  }

  var rotation = new Rotate(coordinate, degrees);
  nodeObject.transformations = nodeObject.transformations || [];
  nodeObject.transformations.push(rotation);

};

LSXParser.prototype.parseNodesScale = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 3) {
    return 'SCALE can only have 3 attributes: sx, sy and sz.';
  }

  var scale = new Scale();
  var error = this.getSXYZ(elementOfNode, scale);
  if (error != null) {
    return error;
  }
  nodeObject.transformations = nodeObject.transformations || [];
  nodeObject.transformations.push(scale);

};

LSXParser.prototype.parseNodesAnimation = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesAnimation was expecting valid arguments.';
  }

  if (elementOfNode.attributes.length != 1) {
    return 'animationref can only have 1 attribute: id.';
  }

  var id = this.reader.getString(elementOfNode, 'id');
  if (id == null) {
    return 'missing id for animationref.';
  }

  nodeObject.animations.push(id);
};
