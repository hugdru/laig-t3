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

Interface.prototype.initCreateLights = function() {

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
