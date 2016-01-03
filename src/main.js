//From https://github.com/EvanHahn/ScriptInclude
include = function() {
  function f() {
    var a = this.readyState;
    (!a || /ded|te/.test(a)) && (c--, !c && e && d())
  }
  var a = arguments,
    b = document,
    c = a.length,
    d = a[c - 1],
    e = d.call;
  e && c--;
  for (var g, h = 0; c > h; h++) g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};
serialInclude = function(a) {
  var b = console,
    c = serialInclude.l;
  if (a.length > 0) c.splice(0, 0, a);
  else b.log("Done!");
  if (c.length > 0) {
    if (c[0].length > 1) {
      var d = c[0].splice(0, 1);
      b.log("Loading " + d + "...");
      include(d, function() {
        serialInclude([]);
      });
    } else {
      var e = c[0][0];
      c.splice(0, 1);
      e.call();
    };
  } else b.log("Finished.");
};
serialInclude.l = new Array();

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m, key, value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  return vars;
}

serialInclude(['../lib/CGF.js',
  // Engine
  'engine/Scene.js', 'engine/SceneGraph.js',
  // Interface
  'interface/Interface.js',
  // Parser
  'parser/LSXParser.js', 'parser/LSXParserUtils.js',
  'parser/LSXParseInitials.js', 'parser/LSXParseIllumination.js',
  'parser/LSXParseLights.js', 'parser/LSXParseTextures.js',
  'parser/LSXParseMaterials.js', 'parser/LSXParseLeaves.js',
  'parser/LSXParseNodes.js', 'parser/LSXParseTablut.js',
  // Primitives
    // Auxiliary
    'primitives/auxiliary/Sphere.js', 'primitives/auxiliary/Cylinder.js',
    'primitives/auxiliary/NURBSPlane.js', 'primitives/auxiliary/Cube.js',
    'primitives/auxiliary/Base.js', 'primitives/auxiliary/Triangle.js',
    'primitives/auxiliary/Rectangle.js', 'primitives/auxiliary/LateralFaces.js',
    // Core
    'primitives/TablutBoard.js', 'primitives/King.js', 'primitives/Pawn.js',
    'primitives/Muscovite.js', 'primitives/Swede.js', 'primitives/Cell.js',
    'primitives/ExitCell.js', 'primitives/ThroneCell.js', 'primitives/MuscoviteCell.js',
    'primitives/SwedeCell.js',
  // Animations
  'animations/AnimationsQueue.js', 'animations/LinearAnimation.js',
  'animations/SlamAnimation.js', 'animations/CameraAnimation.js',
  // Rules
  'rules/Rules.js',
  // Main Tablut file
  'Tablut.js',

  main = function() {
    // Standard application, scene and interface setup
    var cgfApplication = new CGFapplication(document.body);
    var cgfInterface = new Interface();
    var scene = new Scene(cgfInterface);

    cgfApplication.init();

    cgfApplication.setScene(scene);
    cgfApplication.setInterface(cgfInterface);

    cgfInterface.setActiveCamera(scene.camera);

    // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
    // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

    var filename;
    if (filename = getUrlVars()['file']) {
      scene.scenery = filename.split('.')[0];
    } else {
      filename = scene.scenery + '.xml';
    };

    // create and load graph, and associate it to scene.
    // Check console for loading errors
    var myGraph = new SceneGraph(filename, scene);

    // start
    cgfApplication.run();
  }

]);
