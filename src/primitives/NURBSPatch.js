function NURBSPatch(scene, degree, partsU, partsV, controlPoints) {
  this.degree = degree;
  this.partsU = partsU;
  this.partsV = partsV;
  this.controlPoints = this.parseControlPoints(controlPoints);

  //testing
  this.testAppearance = new CGFappearance(scene);
  this.testAppearance.setAmbient(0.3, 0.3, 0.3, 1);
  this.testAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
  this.testAppearance.setSpecular(0.0, 0.0, 0.0, 1);
  this.testAppearance.setShininess(120);
  this.texture = new CGFtexture(scene, "../../scenes/texture.jpg");
  this.testAppearance.setTexture(this.texture);
  this.testAppearance.setTextureWrap('REPEAT', 'REPEAT');

  if (this.degree === 1)
    this.knots = [0, 0, 1, 1];
  else if (this.degree === 2)
    this.knots = [0, 0, 0, 1, 1, 1];
  else if (this.degree === 3)
    this.knots = [0, 0, 0, 0, 1, 1, 1, 1];

  this.surface = new CGFnurbsSurface(this.degree, this.degree, this.knots, this.knots, this.controlPoints);

  getSurfacePoint = function(u, v) {
    return this.surface.getPoint(u,v);
  };

  CGFnurbsObject.call(this, scene, getSurfacePoint, this.partsU, this.partsV);
}

NURBSPatch.prototype = Object.create(CGFnurbsObject.prototype);
NURBSPatch.prototype.constructor = NURBSPatch;

NURBSPatch.prototype.parseControlPoints = function(controlPoints) {
  var parsedControlPoints = [];
  var index = 0;

  for (var i = 0; i <= this.degree; i++) {
    var parsedArray = [];
    for (var j = 0; j <= this.degree; j++) {
      parsedArray.push(controlPoints[index]);
      index++;
    }
    parsedControlPoints.push(parsedArray);
  }

  return parsedControlPoints;
};

// Fixed the textures of the CGFlib
NURBSPatch.prototype.initBuffers = function() {
  this.vertices = [];
  this.faceNormals = [];
  this.texCoords = [];
  this.colors = [];
  this.indices = [];
  this.faces = [];
  var a, b, c;
  var d, e;
  var f = this.partsV + 1;
  var g;
  for (a = 0; a <= this.partsU; a++) {
    e = a / this.partsU;
    for (b = 0; b <= this.partsV; b++) {
      d = b / this.partsV;
      c = this.surface.getPoint(d,e);
      this.vertices.push(c[0]);
      this.vertices.push(c[1]);
      this.vertices.push(c[2]);
      g = vec2.fromValues(a / this.partsU, b / this.partsV);
      this.texCoords.push(g[0]);
      this.texCoords.push(g[1]);
    }
  }
  var h, i, j, k;
  for (a = 0; a < this.partsU; a++)
    for (b = 0; b < this.partsV; b++) {
      h = a * f + b;
      i = a * f + b + 1;
      j = (a + 1) * f + b + 1;
      k = (a + 1) * f + b;
      this.indices.push(h);
      this.indices.push(i);
      this.indices.push(k);
      this.faceNormals.push(this.computeFaceNormal(h, i, k, f));
      this.indices.push(i);
      this.indices.push(j);
      this.indices.push(k);
      this.faceNormals.push(this.computeFaceNormal(i, j, k, f));
    }
  this.normals = this.computeVertexNormals();
  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
