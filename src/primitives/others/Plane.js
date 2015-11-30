function Plane(scene, divisions, vertexTopLeft, vertexBottomRight) {
  CGFobject.call(this, scene);

  if (scene == null ||
    vertexTopLeft.constructor !== Array || vertexTopLeft.length !== 2 ||
    vertexBottomRight.constructor !== Array || vertexBottomRight.length !== 2
  ) {
    throw new Error('Plane, must have valid arguments.');
  }

  this.width = vertexBottomRight[0] - vertexTopLeft[0];
  this.height = vertexTopLeft[1] - vertexBottomRight[1];

  //if (this.width <= 0 || this.height <= 0) throw new Error('Plane, first is topLeft and second is BottomRight.');

  this.startVertex = {
    x: vertexTopLeft[0],
    y: vertexBottomRight[1]
  };

  this.divisions = divisions || 1;

  this.heightStep = this.height / this.divisions;
  this.widthStep = this.width / this.divisions;

  this.rawHeightTextureStep = this.heightStep;
  this.rawWidthTextureStep = this.widthStep;

  this.period = this.divisions + 1;

  this.initBuffers();
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function() {

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.rawTexCoords = [];

  var sCoord = 0;
  var workVertex = {
    x: this.startVertex.x,
    y: this.startVertex.y
  };
  var lengthIndexTimesPeriod = 0;
  var lengthIndexTimesPeriodNext = this.period;
  for (var lengthIndex = 0; lengthIndex <= this.divisions; ++lengthIndex) {

    workVertex.y = this.startVertex.y;
    var tCoord = this.height;
    for (var heightIndex = 0; heightIndex <= this.divisions; ++heightIndex) {

      this.vertices.push(workVertex.x, workVertex.y, 0);
      this.normals.push(0, 0, 1);

      this.rawTexCoords.push(sCoord, tCoord);

      if (lengthIndex !== this.divisions && heightIndex !== this.divisions) {
        this.indices.push(
          heightIndex + lengthIndexTimesPeriod,
          heightIndex + lengthIndexTimesPeriodNext,
          heightIndex + lengthIndexTimesPeriod + 1,
          heightIndex + lengthIndexTimesPeriod + 1,
          heightIndex + lengthIndexTimesPeriodNext,
          heightIndex + lengthIndexTimesPeriodNext + 1
        );
      }

      workVertex.y += this.heightStep;
      tCoord -= this.rawHeightTextureStep;
    }
    workVertex.x += this.widthStep;
    sCoord += this.rawWidthTextureStep;
    lengthIndexTimesPeriod = lengthIndexTimesPeriodNext;
    lengthIndexTimesPeriodNext += this.period;
  }

  this.texCoords = this.rawTexCoords.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
};

Plane.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

Plane.prototype.setTextureAmplification = function(amplifS, amplifT) {
  if (isNaN(amplifS) || isNaN(amplifT) || amplifS === 0 || amplifT === 0) {
    throw new Error('Plane, must receive valid amplifS and amplifT.');
  }

  for (var index = 0; index < this.rawTexCoords.length; index += 2) {
    this.texCoords[index] = this.rawTexCoords[index] / amplifS;
    this.texCoords[index + 1] = this.rawTexCoords[index + 1] / amplifT;
  }

  this.updateTexCoordsGLBuffers();
};
