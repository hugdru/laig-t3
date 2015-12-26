function Base(scene, slices) {
    CGFobject.call(this, scene);

    if (scene == null ||
        slices == null || slices < 3) {
          throw new Error('Base, must have valid arguments');
    }

    this.slices = slices;

    this.tetaStep = 2 * Math.PI / this.slices;
    this.center = { s: 0.5, t: 0.5 };
    this.tetaTextureStep = 1 / this.slices;

    this.initBuffers();
}

Base.prototype = Object.create(CGFobject.prototype);
Base.prototype.constructor = Base;

Base.prototype.initBuffers = function() {

    var nextSlice;
    this.vertices = [0, 0, 0];
    this.indices = [];
    this.normals = [0, 0, 1];
    this.rawTexCoords = [ this.center.s, this.center.t ];

    var teta = 0;
    for (var sliceIndex = 0; sliceIndex < this.slices; ++sliceIndex) {

        // Vertices
        this.vertices.push(
            Math.cos(teta),
            Math.sin(teta),
            0
        );

        this.rawTexCoords.push(
          this.center.s + Math.cos(teta),
          this.center.t + Math.sin(teta)
        );

        // Indices
        this.indices.push(0);
        this.indices.push(sliceIndex + 1);
        if (sliceIndex == (this.slices - 1)) this.indices.push(1);
        else this.indices.push(sliceIndex + 2);

        // Normals
        this.normals.push(0, 0, 1);

        teta += this.tetaStep;
    }

    this.texCoords = this.rawTexCoords.slice();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Base.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

Base.prototype.setTextureAmplification = function(amplifS, amplifT) {
  if (isNaN(amplifS) || isNaN(amplifT) || amplifS === 0 || amplifT === 0) {
    throw new Error('Plane, must receive valid amplifS and amplifT.');
  }

  for (var index = 0; index < this.rawTexCoords.length; index += 2) {
    this.texCoords[index] = this.rawTexCoords[index] / amplifS;
    this.texCoords[index + 1] = this.rawTexCoords[index + 1] / amplifT;
  }

  this.updateTexCoordsGLBuffers();
};

