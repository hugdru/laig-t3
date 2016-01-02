function AnimationsQueue(callback) {
  this.queue = [];
  this.appendQueue = [];
  this.workDone = true;
  this.append = false;
  this.requestId = null;
  this.callback = callback;
}

AnimationsQueue.prototype.update = function(currentUpdateTime) {

  if (this.combineQueues()) {
    this.workDone = false;
  }

  if (this.workDone) {
    return true;
  }

  var self = this;

  if (this.previousUpdateTime == null) {
    this.previousUpdateTime = currentUpdateTime != null ? currentUpdateTime : window.performance.now();
    this.requestId = window.requestAnimationFrame(function() {
      self.update(window.performance.now());
    });
    return;
  }

  var deltaTime = currentUpdateTime - this.previousUpdateTime;

  var allWorkDone = true;
  for (var index = 0; index < this.queue.length; ++index) {
    var singleWorkDone = this.queue[index].update(deltaTime);
    if (singleWorkDone) {
      this.queue.splice(index, 1);
      --index;
    }
    allWorkDone = allWorkDone && singleWorkDone;
  }

  this.previousUpdateTime = currentUpdateTime;

  if (allWorkDone && !this.append) {
    this.previousUpdateTime = null;
    this.requestId = null;
    if (this.callback) {
      this.callback();
    }
  } else {
    this.requestId = window.requestAnimationFrame(function() {
      self.update(window.performance.now());
    });
  }

};

AnimationsQueue.prototype.workDone = function(node) {
  return this.workDone;
};

AnimationsQueue.prototype.kill = function() {
  if (this.requestId) {
    window.cancelAnimationFrame(this.requestId);
  }
  return true;
};

AnimationsQueue.prototype.add = function(obj) {
  if (obj == null) {
    return false;
  }

  this.append = true;
  this.appendQueue.push(obj);

  if (this.workDone) {
    this.update(window.performance.now());
  }

  return true;
};

Array.prototype.extend = function(otherArray) {
  if (otherArray == null || otherArray.constructor !== Array) {
    return false;
  }

  otherArray.forEach(function(obj) {this.push(obj);}, this);

  return true;
};

AnimationsQueue.prototype.combineQueues = function() {
    if (this.appendQueue == null ||
        this.appendQueue.constructor !== Array ||
        this.appendQueue.length === 0)
    {
        return false;
    }
    this.queue.extend(this.appendQueue);
    this.appendQueue = [];
    this.append = false;
    return true;
};
