LSXParser.prototype.parseIllumination = function(rootElement) {
  var illuminationArray = rootElement.getElementsByTagName('ILLUMINATION');
  if (illuminationArray === null || illuminationArray.length !== 1) {
    return 'There must be one and only one ILLUMINATION.';
  }

  var illumination = illuminationArray[0];

  if (illumination.attributes.length !== 0) {
    return 'ILLUMINATION, must not have attributes';
  }

  if (illumination.children.length !== 2)
    return 'ILLUMINATION, must have exactly two children: ambient and background';

  this.graph.illumination = {};

  var error;

  error = this.parseIlluminationAmbient(illumination.getElementsByTagName('ambient'));
  if (error !== undefined)
    return 'ILLUMINATION, ' + error;

  error = this.parseIlluminationBackground(illumination.getElementsByTagName('background'));
  if (error !== undefined)
    return 'ILLUMINATION, ' + error;
};

LSXParser.prototype.parseIlluminationAmbient = function(ambientArray) {
  if (ambientArray === null || ambientArray.length !== 1)
    return 'there must be 1 and only 1 ambient.';

  var ambient = ambientArray[0];

  if (ambient.attributes.length !== 4)
    return 'ambient must have exactly 4 attributes: r, g, b and a.';

  var error = this.getRGBA(ambient, this.graph.illumination.ambient = {});
  if (error !== undefined)
    return error;
};

LSXParser.prototype.parseIlluminationBackground = function(backgroundArray) {
  if (backgroundArray === null || backgroundArray.length !== 1)
    return 'there must be 1 and only 1 background.';

  var background = backgroundArray[0];

  if (background.attributes.length !== 4)
    return 'background must have exactly 4 attributes: r, g, b and a.';

  var error = this.getRGBA(background, this.graph.illumination.background = {});

  if (error !== undefined)
    return error;
};
