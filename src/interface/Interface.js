function Interface() {
  CGFinterface.call(this);
}

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {

  CGFinterface.prototype.init.call(this, application);

  this.gui = new dat.GUI();
};

Interface.prototype.processKeyboard = function(event) {
  CGFinterface.prototype.processKeyboard.call(this, event);
};

Interface.prototype.createTablutGui = function() {
  var tablutGroup = this.gui.addFolder('Tablut');
  tablutGroup.open();

  tablutGroup.add(this.scene.tablut, 'sweedeAI', this.scene.tablut.playerOptions);
  tablutGroup.add(this.scene.tablut, 'muscoviteAI', this.scene.tablut.playerOptions);
  tablutGroup.add(this.scene.tablut, 'dificulty', this.scene.tablut.dificultyOptions);
  tablutGroup.add(this.scene.tablut, 'restart');

  this.testTablutActions = {
    cameraAnimation: false,
    undo: function() {}
  };

  var TablutActions = this.gui.addFolder('Actions');
  TablutActions.open();

  TablutActions.add(this.scene, 'cameraAnimation');
  TablutActions.add(this.scene.tablut, 'undo');

  return true;
};

Interface.prototype.createLightsGui = function() {

  // Lights check boxes
  var lightsGroup = this.gui.addFolder('Lights');
  lightsGroup.open();

  for (var lightIndex = 0; lightIndex < this.scene.lights.filledLength; ++lightIndex) {
    var light = this.scene.lights[lightIndex];
    lightsGroup.add(light, 'enabled').name(light.name).onChange(function(value) {
      var light = this.object;
      if (light.enabled) {
        light.setVisible(true);
      } else {
        light.setVisible(false);
      }
    });
  }

  return true;
};
