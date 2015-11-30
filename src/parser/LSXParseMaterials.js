LSXParser.prototype.parseMaterials = function(rootElement) {

  var materialsArray = rootElement.getElementsByTagName('MATERIALS');
  if (materialsArray === null || materialsArray.length !== 1) {
    return 'There must be 1 and only 1 MATERIALS.';
  }

  var materialsElement = materialsArray[0];
  if (materialsElement.attributes.length !== 0) {
    return 'MATERIALS, must not have attributes.';
  }

  this.graph.materials = {};

  var error;

  var materialsElements = materialsElement.children;
  for (var materialElementIndex = 0; materialElementIndex < materialsElements.length; ++materialElementIndex) {
    var materialElement = materialsElements[materialElementIndex];
    if (materialElement.nodeName !== 'MATERIAL') {
      return 'MATERIALS, ' + materialElement.nodeName + ' element is not valid.';
    }

    if (materialElement.children.length != 5) {
      return 'MATERIAL, there must be exactly 5: shininess, specular, diffuse, ambient and emission.';
    }

    // Get ID
    var id = this.reader.getString(materialElement, 'id');
    if (id == null) {
      return 'MATERIAL, invalid ID.';
    }

    if (this.graph.materials.hasOwnProperty(id)) {
      return 'MATERIAL, ' + id + ', already exists.';
    }

    var material = new CGFappearance(this.graph.scene);

    error = this.parseMaterialsShininess(material, materialElement.getElementsByTagName('shininess'));
    if (error !== undefined)
      return 'MATERIAL, ' + id + ', ' + error;
    error = this.parseMaterialsSpecular(material, materialElement.getElementsByTagName('specular'));
    if (error !== undefined)
      return 'MATERIAL, ' + id + ', ' + error;
    error = this.parseMaterialsDiffuse(material, materialElement.getElementsByTagName('diffuse'));
    if (error !== undefined)
      return 'MATERIAL, ' + id + ', ' + error;
    error = this.parseMaterialsAmbient(material, materialElement.getElementsByTagName('ambient'));
    if (error !== undefined)
      return 'MATERIAL, ' + id + ', ' + error;
    error = this.parseMaterialsEmission(material, materialElement.getElementsByTagName('emission'));
    if (error !== undefined)
      return 'MATERIAL, ' + id + ', ' + error;

    this.graph.materials[id] = material;
  }
};

LSXParser.prototype.parseMaterialsShininess = function(material, shininessArray) {

  if (material == null || shininessArray == null || shininessArray.length != 1) {
    return 'there must be 1 and only 1 shininess.';
  }

  var shininessElement = shininessArray[0];

  if (shininessElement.attributes.length !== 1) {
    return 'shininess element must have exactly 1 attribute: value.';
  }

  var shininess = this.reader.getFloat(shininessElement, 'value');
  if (shininess == null || isNaN(shininess)) {
    return 'invalid value for value attribute of shininess, must be a number.';
  }

  material.setShininess(shininess);
};

LSXParser.prototype.parseMaterialsSpecular = function(material, specularArray) {
  if (material == null || specularArray == null || specularArray.length != 1) {
    return 'there must be 1 and only 1 specular.';
  }

  var specularElement = specularArray[0];

  if (specularElement.attributes.length !== 4) {
    return 'specular element must have exactly 4 attributes: r, g, b and a.';
  }

  var specular = {};
  var error = this.getRGBA(specularElement, specular);
  if (error != null) {
    return error;
  }

  material.setSpecular(specular.r, specular.g, specular.b, specular.a);
};

LSXParser.prototype.parseMaterialsDiffuse = function(material, diffuseArray) {
  if (material == null || diffuseArray == null || diffuseArray.length != 1) {
    return 'there must be 1 and only 1 diffuse.';
  }

  var diffuseElement = diffuseArray[0];

  if (diffuseElement.attributes.length !== 4) {
    return 'difuse element must have exactly 4 attributes: r, g, b and a.';
  }

  var diffuse = {};
  var error = this.getRGBA(diffuseElement, diffuse);
  if (error != null) {
    return error;
  }

  material.setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
};

LSXParser.prototype.parseMaterialsAmbient = function(material, ambientArray) {
  if (material == null || ambientArray == null || ambientArray.length != 1) {
    return 'there must be 1 and only 1 ambient.';
  }

  var ambientElement = ambientArray[0];

  if (ambientElement.attributes.length !== 4) {
    return 'ambient element must have exactly 4 attributes: r, g, b and a.';
  }

  var ambient = {};
  var error = this.getRGBA(ambientElement, ambient);
  if (error != null) {
    return error;
  }

  material.setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
};

LSXParser.prototype.parseMaterialsEmission = function(material, emissionArray) {
  if (material == null || emissionArray == null || emissionArray.length != 1) {
    return 'there must be 1 and only 1 emission.';
  }

  var emissionElement = emissionArray[0];

  if (emissionElement.attributes.length !== 4) {
    return 'emission element must have exactly 4 attributes: r, g, b and a.';
  }

  var emission = {};
  var error = this.getRGBA(emissionElement, emission);
  if (error != null) {
    return error;
  }

  material.setEmission(emission.r, emission.g, emission.b, emission.a);
};
