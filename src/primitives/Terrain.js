function Terrain(scene, texture, heightmap) {

  this.scene = scene;
  CGFobject.call(this, scene);

  this.texture = texture;
  this.heightmap = heightmap;

  this.appearance = new CGFappearance(this.scene);
  this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
  this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
  this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
  this.appearance.setShininess(120);

  this.texture_terrain = new CGFtexture(this.scene, this.texture);
  this.heightmap_terrain = new CGFtexture(this.scene, this.heightmap);
  this.appearance.setTexture(this.texture_terrain);
  this.appearance.setTextureWrap('REPEAT', 'REPEAT');

  this.testShaders = [
    new CGFshader(this.scene.gl, "shaders/flat.vert", "shaders/flat.frag"),
    new CGFshader(this.scene.gl, "shaders/myShader.vert", "shaders/myShader.frag"),
    new CGFshader(this.scene.gl, "shaders/uScale.vert", "shaders/uScale.frag"),
    new CGFshader(this.scene.gl, "shaders/varying.vert", "shaders/varying.frag"),
    new CGFshader(this.scene.gl, "shaders/texture1.vert", "shaders/texture1.frag"),
    new CGFshader(this.scene.gl, "shaders/texture2.vert", "shaders/texture2.frag"),
    new CGFshader(this.scene.gl, "shaders/texture3.vert", "shaders/texture3.frag")
  ];

  this.testShaders[1].setUniformsValues({
    uSampler2: 1
  });
  this.testShaders[1].setUniformsValues({
    scale: 0.5
  });

  this.plane = new NURBSPlane(this.scene, 250);
}

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display = function() {
  this.appearance.apply();
  this.scene.setActiveShader(this.testShaders[1]);

  this.scene.pushMatrix();

  this.heightmap_terrain.bind(1);

  this.plane.display();
  this.scene.popMatrix();

  this.scene.setActiveShader(this.scene.defaultShader);
};
