function Sphere(scene, radius, tetaSections, phiSections) {
  CGFobject.call(this, scene);

  if (scene == null || radius == null || radius <= 0 ||
      tetaSections == null || tetaSections < 3 || phiSections == null ||
      phiSections < 2
     ) {
    throw new Error('Sphere, must have valid arguments.');
  }

  this.radius = radius;
  this.tetaSections = tetaSections;
  this.phiSections = phiSections;
  this.tetaPeriod = this.tetaSections + 1;

  this.tetaStep = (2 * Math.PI) / this.tetaSections;
  this.phiStep = Math.PI / this.phiSections;
  this.tetaTextureStep = 1 / this.tetaSections;
  this.phiTextureStep = 1 / this.phiSections;

  this.initBuffers();
  this.wireframe = false;
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.rawTexCoords = [];

  var tCoord = 1;
  var phiAccumulator = 0;
  var tetaPeriodTimesPhiIndex = 0;
  var tetaPeriodTimesNextPhiIndex = this.tetaPeriod;
  for (var phiIndex = 0; phiIndex <= this.phiSections; ++phiIndex) {

    var tetaAccumulator = 0;
    var vertexY = this.radius * Math.cos(phiAccumulator);
    var sinPhiAccumulator = Math.sin(phiAccumulator);

    var sCoord = 0;
    for (var tetaIndex = 0; tetaIndex <= this.tetaSections; ++tetaIndex) {

      var vertexX = this.radius * sinPhiAccumulator * Math.sin(tetaAccumulator);
      var vertexZ = this.radius * sinPhiAccumulator * Math.cos(tetaAccumulator);

      this.vertices.push(vertexX, vertexY, vertexZ);
      this.rawTexCoords.push(sCoord, tCoord);
      this.normals.push(vertexX / this.radius, vertexY / this.radius, vertexZ / this.radius);

      // Indices
      if (phiIndex != this.phiSections && tetaIndex != this.tetaSections) {
        this.indices.push(
          tetaIndex + tetaPeriodTimesPhiIndex,
          tetaIndex + tetaPeriodTimesNextPhiIndex + 1,
          tetaIndex + tetaPeriodTimesPhiIndex + 1,
          tetaIndex + tetaPeriodTimesPhiIndex,
          tetaIndex + tetaPeriodTimesNextPhiIndex,
          tetaIndex + tetaPeriodTimesNextPhiIndex + 1
        );
      }
      sCoord += this.tetaTextureStep;
      tetaAccumulator += this.tetaStep;
    }
    tCoord -= this.phiTextureStep;
    phiAccumulator -= this.phiStep;
    tetaPeriodTimesPhiIndex = tetaPeriodTimesNextPhiIndex;
    tetaPeriodTimesNextPhiIndex += this.tetaPeriod;
  }

  this.texCoords = this.rawTexCoords.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};

Sphere.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

Sphere.prototype.setTextureAmplification = function(amplifS, amplifT) {
  if (isNaN(amplifS) || isNaN(amplifT) || amplifS === 0 || amplifT === 0) {
    throw new Error('Plane, must receive valid amplifS and amplifT.');
  }

  for (var index = 0; index < this.rawTexCoords.length; index += 2) {
    this.texCoords[index] = this.rawTexCoords[index] / amplifS;
    this.texCoords[index + 1] = this.rawTexCoords[index + 1] / amplifT;
  }

  this.updateTexCoordsGLBuffers();
};
