function Vehicle(scene) {

  this.scene = scene;
  CGFobject.call(this, scene);
  this.patch = new NURBSPatch(scene, 3, 50, 50,
      [
        [0,-0.5,0,1],
        [0,-0.25,0,1],
        [0,0.25,0,1],
        [0,0.5,0,1],

        [0.25,-0.5,0.5,1],
        [0.25,-0.25,0.5,1],
        [0.25,0.25,0.5,1],
        [0.25,0.5,0.5,1],

        [0.75,-0.5,-0.5,1],
        [0.75,-0.25,-0.5,1],
        [0.75,0.25,-0.5,1],
        [0.75,0.5,-0.5,1],

        [1,-0.5,0,1],
        [1,-0.25,0,1],
        [1,0.25,0,1],
        [1,0.5,0,1]
      ]
  );
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
  this.scene.gl.disable(this.scene.gl.CULL_FACE);

  this.scene.pushMatrix();
  this.scene.rotate(Math.PI/2, 1, 0, 0);
  this.patch.display();
  this.scene.rotate(Math.PI, 1, 0, 0);
  this.patch.display();
  this.scene.popMatrix();

  this.scene.gl.enable(this.scene.gl.CULL_FACE);
};
