window['SceneRenderer'] = function(g3, scene) {
  var self = this;
  
  return self;
};
window['Renderer'] = function(type) {
	var self = Object.create(null);
	self.type = type;
	self.canRender = function(renderable) {
		return renderable.getType() == type;
	};
	self.render = function(renderable, ctx) {
		throw(new Error("Not a valid renderer!"));
	};
	return self;
};
window['SphereRenderer'] = function() {
	var self = new Renderer("Sphere");
	self.canRender = function(renderable) {
		return renderable.getType().contains('Atom') || renderable.getType() == self.type;
	};
	self.render = function(renderable, ctx) {
		
	};
	return self;
}();
window['CylinderRenderer'] = function(g3, x, y, z, r, h) {
  var self = this;
  
  return self;
};
