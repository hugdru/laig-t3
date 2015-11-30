function NURBSPlane(scene, parts) {
  this.parts = parts || 1;

  //testing
  this.testAppearance = new CGFappearance(scene);
	this.testAppearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.testAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.testAppearance.setSpecular(0.0, 0.0, 0.0, 1);
	this.testAppearance.setShininess(120);
	this.texture = new CGFtexture(scene, "../../scenes/texture.jpg");
	this.testAppearance.setTexture(this.texture);
	this.testAppearance.setTextureWrap ('REPEAT', 'REPEAT');

  this.surface = new CGFnurbsSurface(1,1,[0,0,1,1],[0,0,1,1],
      [
        [
          [-0.5, 0.0, -0.5, 1],
          [0.5, 0.0, -0.5, 1]
        ],

        [
          [-0.5, 0.0, 0.5, 1],
          [0.5, 0.0, 0.5, 1]
        ]
      ]);

  getSurfacePoint = function(u, v) {
    return this.surface.getPoint(u,v);
  };

  CGFnurbsObject.call(this, scene, getSurfacePoint, this.parts, this.parts);
}

NURBSPlane.prototype = Object.create(CGFnurbsObject.prototype);
NURBSPlane.prototype.constructor = NURBSPlane;

// Fixed the textures of the CGFlib
NURBSPlane.prototype.initBuffers = function() {
  this.vertices = [];
  this.faceNormals = [];
  this.texCoords = [];
  this.colors = [];
  this.indices = [];
  this.faces = [];
  var a, b, c;
  var d, e;
  var f = this.parts + 1;
  var g;
  for (a = 0; a <= this.parts; a++) {
    e = a / this.parts;
    for (b = 0; b <= this.parts; b++) {
      d = b / this.parts;
      c = this.surface.getPoint(d,e);
      this.vertices.push(c[0]);
      this.vertices.push(c[1]);
      this.vertices.push(c[2]);
      g = vec2.fromValues(a / this.parts, b / this.parts);
      this.texCoords.push(g[0]);
      this.texCoords.push(g[1]);
    }
  }
  var h, i, j, k;
  for (a = 0; a < this.parts; a++)
    for (b = 0; b < this.parts; b++) {
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
