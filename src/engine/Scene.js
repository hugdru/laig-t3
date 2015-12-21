degreeToRad = Math.PI / 180;

function Scene(cgfInterface) {
  CGFscene.call(this);

  this.cgfInterface = cgfInterface;
}

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);
};

Scene.prototype.initLights = function() {

  this.setActiveShader(this.defaultShader);

  var index = 0;
  for (var lightName in this.graph.lights) {
    var light = this.graph.lights[lightName];

    this.lights[index].name = lightName;
    this.lights[index].enabled = light.enabled;

    this.lights[index].setPosition(light.position.x, light.position.y, light.position.z, light.position.w);
    this.lights[index].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
    this.lights[index].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
    this.lights[index].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

    this.lights[index].name = lightName;

    if (this.lights[index].enabled) {
      this.lights[index].enable();
      this.lights[index].setVisible(true);
    } else {
      this.lights[index].disable();
      this.lights[index].setVisible(false);
    }

    //this.lights[index].setConstantAttenuation(1);
    //this.lights[index].setLinearAttenuation(1);
    //this.lights[index].setQuadraticAttenuation(0);

    ++index;
  }

  this.lights.filledLength = index;

  this.lightsCreated = true;

  this.cgfInterface.initCreateLights();
};

Scene.prototype.initCameras = function() {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(18, 18, 18), vec3.fromValues(0, 0, 0));
};

Scene.prototype.updateLights = function() {
  for (i = 0; i < this.lights.filledLength; i++) {
    this.lights[i].update();
  }
};

Scene.prototype.setDefaultAppearance = function() {
  this.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
Scene.prototype.onGraphLoaded = function() {
  /**** DEBUG ****/
  console.log(this.graph);
  console.log(this);
  /***************/

  /** INITIALS **/
  // Frustum
  this.camera.near = this.graph.initials.frustum.near;
  this.camera.far = this.graph.initials.frustum.far;
  // Reference
  this.axis = new CGFaxis(this, this.graph.initials.reference);

  /** ILLUMINATION **/
  // background
  this.gl.clearColor(this.graph.illumination.background.r, this.graph.illumination.background.g, this.graph.illumination.background.b, this.graph.illumination.background.a);
  // ambient
  this.setGlobalAmbientLight(this.graph.illumination.ambient.r, this.graph.illumination.ambient.g, this.graph.illumination.ambient.b, this.graph.illumination.ambient.a);

  /** LIGHTS **/
  this.initLights();

  /** TEXTURES **/
  this.enableTextures(true);
};

Scene.prototype.display = function() {
  // ---- BEGIN Background, camera and axis setup
  this.setActiveShader(this.defaultShader);

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  this.setDefaultAppearance();

  // ---- END Background, camera and axis setup

  // it is important that things depending on the proper loading of the graph
  // only get executed after the graph has loaded correctly.
  // This is one possible way to do it
  if (this.graph.isLoaded) {

    var initials = this.graph.initials;
    this.translate(initials.translate.x, initials.translate.y, initials.translate.z);
    this.rotate(degreeToRad * initials.rotation.x, 1, 0, 0);
    this.rotate(degreeToRad * initials.rotation.y, 0, 1, 0);
    this.rotate(degreeToRad * initials.rotation.z, 0, 0, 1);
    this.scale(initials.scale.sx, initials.scale.sy, initials.scale.sz);

    if (this.lightsCreated) {
      this.updateLights();
    }

    // Draw axis
    if (this.graph.initials.reference !== 0) {
      this.axis.display();
    }

    var root = this.graph.nodes.root;
    this.graph.display(root, root.material, root.material.texture);
  }
};
