LSXParser.prototype.parseLights = function(rootElement) {

  var lightsArray = rootElement.getElementsByTagName('LIGHTS');
  if (lightsArray === null || lightsArray.length !== 1) {
    return 'There must be 1 and only 1 LIGHTS.';
  }

  var lightsElement = lightsArray[0];

  if (lightsElement.attributes.length !== 0) {
    return 'LIGHTS, must not have attributes.';
  }

  this.graph.lights = {};

  var error;

  var lightsElements = lightsElement.children;
  var lightsElementsLength = lightsElements.length;
  if (lightsElementsLength < 1 || lightsElementsLength > 8) {
    return 'LIGHTS, there must be at least 1 LIGHT and at most 8 LIGHT';
  }
  for (var lightElementIndex = 0; lightElementIndex < lightsElementsLength; ++lightElementIndex) {
    var lightElement = lightsElements[lightElementIndex];
    if (lightElement.nodeName !== 'LIGHT') {
      return 'LIGHTS, ' + lightElement.nodeName + ' element is not valid.';
    }

    if (lightElement.children.length != 5) {
      return 'LIGHT, there must be exactly 5 elements: enable, position, ambient, diffuse and specular.';
    }

    // Get ID
    var id = this.reader.getString(lightElement, 'id');
    if (id == null) {
      return 'LIGHT, invalid ID.';
    }

    if (this.graph.lights.hasOwnProperty(id)) {
      return 'LIGHT, ' + id + ', already exists.';
    }

    this.graph.lights[id] = {};
    var light = this.graph.lights[id];

    error = this.parseLightsEnable(light, lightElement.getElementsByTagName('enable'));
    if (error !== undefined)
      return 'LIGHT, ' + id + ', ' + error;
    error = this.parseLightsPosition(light, lightElement.getElementsByTagName('position'));
    if (error !== undefined)
      return 'LIGHT, ' + id + ', ' + error;
    error = this.parseLightsAmbient(light, lightElement.getElementsByTagName('ambient'));
    if (error !== undefined)
      return 'LIGHT, ' + id + ', ' + error;
    error = this.parseLightsDiffuse(light, lightElement.getElementsByTagName('diffuse'));
    if (error !== undefined)
      return 'LIGHT, ' + id + ', ' + error;
    error = this.parseLightsSpecular(light, lightElement.getElementsByTagName('specular'));
    if (error !== undefined)
      return 'LIGHT, ' + id + ', ' + error;
  }
};

LSXParser.prototype.parseLightsEnable = function(light, enableArray) {

  if (light == null || enableArray == null || enableArray.length != 1) {
    return 'there must be 1 and only 1 enable.';
  }

  var enableElement = enableArray[0];

  if (enableElement.attributes.length !== 1) {
    return 'enable element must have exactly one attribute: value.';
  }

  light.enabled = this.reader.getBoolean(enableElement, 'value');
  if (light.enabled == null) {
    return 'invalid value attribute for enable, must be either 0 or 1.';
  }
};

LSXParser.prototype.parseLightsPosition = function(light, positionArray) {

  if (light == null || positionArray == null || positionArray.length !== 1) {
    return 'there must be 1 and only 1 position element.';
  }

  var positionElement = positionArray[0];

  if (positionElement.attributes.length !== 4) {
    return 'position element must have exactly four attributes: x, y, z, w.';
  }

  var error = this.getAttributesFloat(positionElement, ['x', 'y', 'z', 'w'], light.position = {});
  if (error != null) {
    return error;
  }
};

LSXParser.prototype.parseLightsAmbient = function(light, ambientArray) {
  if (light == null || ambientArray == null || ambientArray.length != 1) {
    return 'there must be 1 and only 1 ambient.';
  }

  var ambientElement = ambientArray[0];

  if (ambientElement.attributes.length !== 4) {
    return 'ambient element must have exactly 4 attributes: r, g, b, a.';
  }

  var error = this.getRGBA(ambientElement, light.ambient = {});
  if (error != null) {
    return error;
  }
};

LSXParser.prototype.parseLightsDiffuse = function(light, diffuseArray) {
  if (light == null || diffuseArray == null || diffuseArray.length != 1) {
    return 'there must be 1 and only 1 diffuse';
  }

  var diffuseElement = diffuseArray[0];

  if (diffuseElement.attributes.length !== 4) {
    return 'diffuse element must have exactly 4 attributes: r, g, b, a.';
  }

  var error = this.getRGBA(diffuseElement, light.diffuse = {});
  if (error != null) {
    return error;
  }

};

LSXParser.prototype.parseLightsSpecular = function(light, specularArray) {
  if (light == null || specularArray == null || specularArray.length != 1) {
    return 'there must be 1 and only 1 specular.';
  }

  var specularElement = specularArray[0];

  if (specularElement.attributes.length !== 4) {
    return 'specular element must have exactly 4 attributes: r, g, b, a.';
  }

  var error = this.getRGBA(specularElement, light.specular = {});
  if (error != null) {
    return error;
  }
};
