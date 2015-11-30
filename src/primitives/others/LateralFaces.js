function LateralFaces(scene, height, bottomRadius, topRadius, slices, stacks) {
  CGFobject.call(this, scene);

  if (scene == null ||
    height == null || height <= 0 ||
    bottomRadius == null || bottomRadius < 0 ||
    topRadius == null || topRadius < 0 ||
    topRadius === 0 && bottomRadius === 0 ||
    slices == null || slices < 3 ||
    stacks == null || stacks < 1)
    {
    throw new Error('LateralFaces, must have valid arguments.');
  }

  this.slices = slices;
  this.stacks = stacks;
  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;

  this.tetaStep = (2 * Math.PI) / this.slices;
  this.stackStep = this.height / this.stacks;
  this.radiusStep = (this.topRadius - this.bottomRadius) / this.height * this.stackStep;

  this.stackPeriod = this.stacks + 1;

  this.rawTetaTextureStep = 1 / this.slices;
  this.rawStackTextureStep = 1 / this.stacks;

  this.initBuffers();
}

LateralFaces.prototype = Object.create(CGFobject.prototype);
LateralFaces.prototype.constructor = LateralFaces;

LateralFaces.prototype.initBuffers = function() {
  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.rawTexCoords = [];

  var sCoord = 0;
  var teta = 0;
  var stackPeriodTimesSliceIndex = 0;
  var stackPeriodTimesSliceIndexNext = this.stackPeriod;
  for (var sliceIndex = 0; sliceIndex <= this.slices; ++sliceIndex) {

    var radius = this.bottomRadius;
    var stackAccumulator = 0;
    var tCoord = 0;

    for (var stackIndex = 0; stackIndex <= this.stacks; ++stackIndex) {

      var vertexX = radius * Math.cos(teta);
      var vertexY = radius * Math.sin(teta);

      /* Vertex */
      this.vertices.push(vertexX, vertexY, stackAccumulator);

      /* Texture */
      this.rawTexCoords.push(sCoord, tCoord);

      /* Normals */
      this.normals.push(vertexX / radius, vertexY / radius, 0);

      /* Indices */
      if (stackIndex != this.stacks && sliceIndex != this.slices) {
        var startVertex = stackIndex + 1;
        this.indices.push(
          startVertex + stackPeriodTimesSliceIndex,
          startVertex + stackPeriodTimesSliceIndex - 1,
          startVertex + stackPeriodTimesSliceIndexNext - 1,
          startVertex + stackPeriodTimesSliceIndex,
          startVertex + stackPeriodTimesSliceIndexNext - 1,
          startVertex + stackPeriodTimesSliceIndexNext
        );
      }
      tCoord += this.rawStackTextureStep;
      stackAccumulator += this.stackStep;
      radius += this.radiusStep;
    }
    sCoord += this.rawTetaTextureStep;
    teta += this.tetaStep;
    stackPeriodTimesSliceIndex = stackPeriodTimesSliceIndexNext;
    stackPeriodTimesSliceIndexNext += this.stackPeriod;
  }
  this.texCoords = this.rawTexCoords.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};

LateralFaces.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

LateralFaces.prototype.setTextureAmplification = function(amplifS, amplifT) {
  if (isNaN(amplifS) || isNaN(amplifT) || amplifS === 0 || amplifT === 0) {
    throw new Error('Plane, must receive valid amplifS and amplifT.');
  }

  for (var index = 0; index < this.rawTexCoords.length; index += 2) {
    this.texCoords[index] = this.rawTexCoords[index] / amplifS;
    this.texCoords[index + 1] = this.rawTexCoords[index + 1] / amplifT;
  }

  this.updateTexCoordsGLBuffers();
};
