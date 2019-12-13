
var Blur = function () {
	this.frameA = twgl.createFramebufferInfo(gl);
	this.frameB = twgl.createFramebufferInfo(gl);
	this.iterations = 8;
	this.write;
	this.read;

	this.update = function (frame) {
		this.write = this.frameA;
		this.read = this.frameB;
		for (var i = 0; i < this.iterations; i++) {
			var radius = (this.iterations - i - 1)
			if (i === 0) uniforms.frame = frame.attachments[0];
			else uniforms.frame = this.read.attachments[0];
			uniforms.flip = true;
			uniforms.direction = i % 2 === 0 ? [radius, 0] : [0, radius];
			drawFrame(asset.material['blur'], this.write.framebuffer);
			var t = this.write;
			this.write = this.read;
			this.read = t;
		}
	}

	this.resize = function () {
		twgl.resizeFramebufferInfo(gl, this.frameA);
		twgl.resizeFramebufferInfo(gl, this.frameB);
	}
}