LSXParser.prototype.parseTextures = function(rootElement) {

  var texturesArray = rootElement.getElementsByTagName('TEXTURES');
  if (texturesArray === null || texturesArray.length !== 1) {
    return 'There must be 1 and only 1 TEXTURES.';
  }

  var texturesElement = texturesArray[0];

  if (texturesElement.attributes.length !== 0) {
    return 'TEXTURES, must not have attributes';
  }

  this.graph.textures = {};

  var error;

  var texturesElements = texturesElement.children;
  for (var textureElementIndex = 0; textureElementIndex < texturesElements.length; ++textureElementIndex) {
    var textureElement = texturesElements[textureElementIndex];
    if (textureElement.nodeName !== 'TEXTURE') {
      return 'TEXTURES, ' + textureElement.nodeName + ' element is not valid.';
    }

    if (textureElement.children.length != 2) {
      return 'TEXTURE, there must be exactly 2 elements: file and amplif_factor.';
    }

    // Get ID
    var id = this.reader.getString(textureElement, 'id');
    if (id == null) {
      return 'Invalid ID for TEXTURE.';
    }

    if (this.graph.textures.hasOwnProperty(id)) {
      return 'TEXTURE, ' + id + ', already exists.';
    }

    var texture = {};

    error = this.parseTexturesFile(texture, textureElement.getElementsByTagName('file'));
    if (error !== undefined)
      return 'TEXTURE, ' + id + ', ' + error;
    error = this.parseTexturesAmplif_factor(texture, textureElement.getElementsByTagName('amplif_factor'));
    if (error !== undefined)
      return 'TEXTURE, ' + id + ', ' + error;

    this.graph.textures[id] = new CGFtexture(this.graph.scene, texture.path);
    this.graph.textures[id].amplifFactor = texture.amplifFactor;
  }
};

LSXParser.prototype.parseTexturesFile = function(texture, fileArray) {

  if (texture == null || fileArray == null || fileArray.length != 1) {
    return 'there must be 1 and only 1 file.';
  }

  var fileElement = fileArray[0];

  if (fileElement.attributes.length !== 1) {
    return 'file element must have exactly 1 attribute: path.';
  }

  texture.path = this.reader.getString(fileElement, 'path');
  if (texture.path == null) {
    return 'invalid value for attribute path of file, must be a string.';
  }

  texture.path = "../scenes/" + texture.path;
};

LSXParser.prototype.parseTexturesAmplif_factor = function(texture, Amplif_factorArray) {
  if (texture == null || Amplif_factorArray == null || Amplif_factorArray.length !== 1) {
    return 'there must be 1 and only one specular';
  }

  var Amplif_factorElement = Amplif_factorArray[0];

  if (Amplif_factorElement.attributes.length !== 2) {
    return 'amplif_factor element must have exactly 2 attributes: s, t.';
  }

  var error = this.getAttributesFloat(Amplif_factorElement, ['s', 't'], texture.amplifFactor = {});
  if (error != null) {
    return error;
  }
};

