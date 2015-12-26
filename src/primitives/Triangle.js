function Triangle(scene, v1, v2, v3) {
  CGFobject.call(this, scene);

  if (scene == null ||
    v1.constructor !== Array || v1.length !== 3 ||
    v2.constructor !== Array || v2.length !== 3 ||
    v3.constructor !== Array || v3.length !== 3
  ) {
    throw new Error('Triangle, must have valid arguments.');
  }

  this.vertexA = v1;
  this.vertexB = v2;
  this.vertexC = v3;

  this.distAC = Math.sqrt(
    (this.vertexA[0] - this.vertexC[0]) * (this.vertexA[0] - this.vertexC[0]) +
    (this.vertexA[1] - this.vertexC[1]) * (this.vertexA[1] - this.vertexC[1]) +
    (this.vertexA[2] - this.vertexC[2]) * (this.vertexA[2] - this.vertexC[2])
  );

  this.distBA = Math.sqrt(
    (this.vertexB[0] - this.vertexA[0]) * (this.vertexB[0] - this.vertexA[0]) +
    (this.vertexB[1] - this.vertexA[1]) * (this.vertexB[1] - this.vertexA[1]) +
    (this.vertexB[2] - this.vertexA[2]) * (this.vertexB[2] - this.vertexA[2])
  );

  this.distCB = Math.sqrt(
    (this.vertexC[0] - this.vertexB[0]) * (this.vertexC[0] - this.vertexB[0]) +
    (this.vertexC[1] - this.vertexB[1]) * (this.vertexC[1] - this.vertexB[1]) +
    (this.vertexC[2] - this.vertexB[2]) * (this.vertexC[2] - this.vertexB[2])
  );

  this.cosA = (-this.distCB * this.distCB + this.distAC * this.distAC + this.distBA * this.distBA) / (2 * this.distAC * this.distBA);
  this.cosB = (this.distCB * this.distCB - this.distAC * this.distAC + this.distBA * this.distBA) / (2 * this.distCB * this.distBA);
  this.cosC = (this.distCB * this.distCB + this.distAC * this.distAC - this.distBA * this.distBA) / (2 * this.distCB * this.distAC);

  this.angA = Math.acos(this.cosA);
  this.angB = Math.acos(this.cosB);
  this.angC = Math.acos(this.cosC);
  this.sum = this.angB + this.angA + this.angC;
  // the sum of internal angles needs to be 180 or 3.14159
  // check this.sum to see that!

  this.initBuffers();
  this.wireframe = false;
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {

  this.vertices = [
    // Front face
    this.vertexA[0], this.vertexA[1], this.vertexA[2],
    this.vertexB[0], this.vertexB[1], this.vertexB[2],
    this.vertexC[0], this.vertexC[1], this.vertexC[2]
  ];

  var vectorCB = [this.vertexC[0] - this.vertexB[0], this.vertexC[1] - this.vertexB[1], this.vertexC[2] - this.vertexB[2]];
  var vectorAC = [this.vertexA[0] - this.vertexC[0], this.vertexA[1] - this.vertexC[1], this.vertexA[2] - this.vertexC[2]];

  var perpendicularVector = [
    vectorCB[1] * vectorAC[2] - vectorAC[1] * vectorCB[2],
    vectorCB[0] * vectorAC[2] - vectorAC[0] * vectorCB[2],
    vectorCB[0] * vectorAC[1] - vectorAC[0] * vectorCB[1]
  ];

  var perpendicularVectorNorm = Math.sqrt(
    Math.pow(perpendicularVector[0], 2) +
    Math.pow(perpendicularVector[1], 2) +
    Math.pow(perpendicularVector[2], 2)
  );

  perpendicularVector = [
    perpendicularVector[0] / perpendicularVectorNorm,
    perpendicularVector[1] / perpendicularVectorNorm,
    perpendicularVector[2] / perpendicularVectorNorm
  ];

  this.normals = [
    // Front face
    perpendicularVector[0], perpendicularVector[1], perpendicularVector[2],
    perpendicularVector[0], perpendicularVector[1], perpendicularVector[2],
    perpendicularVector[0], perpendicularVector[1], perpendicularVector[2]
  ];

  this.rawTexCoords = [
    0, 1,
    this.distBA, 1,
    this.distAC * Math.cos(this.angA), (1 - this.distAC * Math.sin(this.angA))
  ];

  this.indices = [
    0, 1, 2
  ];

  this.texCoords = this.rawTexCoords.slice();

  this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
  this.initGLBuffers();
};

Triangle.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

Triangle.prototype.setTextureAmplification = function(amplifS, amplifT) {
  if (isNaN(amplifS) || isNaN(amplifT) || amplifS === 0 || amplifT === 0) {
    throw new Error('Triangle, must receive valid amplifS and amplifT.');
  }

  for (var index = 0; index < this.rawTexCoords.length; index += 2) {
    this.texCoords[index] = this.rawTexCoords[index] / amplifS;
    this.texCoords[index + 1] = this.rawTexCoords[index + 1] / amplifT;
  }

  this.updateTexCoordsGLBuffers();
};
