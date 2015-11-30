function LSXParser(sceneGraph) {
  this.graph  = sceneGraph;
  this.reader = sceneGraph.reader;
}

LSXParser.prototype.read = function(rootElement) {
  var error;

  error = this.parseInitials(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseIllumination(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseLights(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseTextures(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseMaterials(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseLeaves(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseNodes(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseAnimations(rootElement);
  if (error !== undefined)
    return error;

  delete this.graph.nodes.all;
};
