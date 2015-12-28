LSXParser.prototype.parseTablut = function(rootElement) {

  var tablutArray = rootElement.getElementsByTagName('TABLUT');
  if (tablutArray === null || tablutArray.length !== 1) {
    return 'There must be 1 and only 1 TABLUT.';
  }

  var tablut = tablutArray[0];

  if (tablut.attributes.length !== 0) {
    return 'TABLUT, must not have attributes';
  }

  var entities = ['SWEDE', 'MUSCOVITE', 'KING', 'EXIT', 'THRONE', 'SWEDECELL', 'MUSCOVITECELL', 'CELLS', 'FRAME'];

  var error = 'TABLUT, ';
  var tablutChildrenLength = tablut.children.length;
  if (tablutChildrenLength !== entities.length) {
    var allEntities = entities[0];
    index = 1;
    while (index < tablutChildrenLength) {
      allEntities += ", " + entities[index];
      ++index;
    }
    return error + 'must have exactly' + tablutChildrenLength + ': ' + allEntities + '.';
  }

  this.graph.tablut = {};
  for (var entityIndex = 0; entityIndex < tablutChildrenLength; ++entityIndex) {

    var entity = entities[entityIndex];
    var tablutElement = tablut.getElementsByTagName(entity);

    var entityError = error + entity + ', ';
    if (tablutElement == null || tablutElement.length !== 1) {
      return error + 'there must be 1 and only 1 ' + entity;
    }
    tablutElement = tablutElement[0];

    if (tablutElement.attributes.length !== 2) {
      return entityError + 'must have exactly two attributes: texture and material.';
    }

    var textureId = this.reader.getString(tablutElement, 'texture');
    if (textureId == null) {
      return entityError + 'must have a texture attribute.';
    }
    var materialId = this.reader.getString(tablutElement, 'material');
    if (materialId == null) {
      return entityError + 'must have a material attribute.';
    }

    var tablutObject = {};
    if (this.graph.textures.hasOwnProperty(textureId)) {
      tablutObject.texture = this.graph.textures[textureId];
    } else {
      return entityError + 'texture must have a valid id.';
    }

    if (this.graph.materials.hasOwnProperty(materialId)) {
      tablutObject.material = this.graph.materials[materialId];
    } else {
      return entityError + 'material must have a valid id.';
    }

    entity = entity.toLowerCase();
    this.graph.tablut[entity] = tablutObject;
  }
};
