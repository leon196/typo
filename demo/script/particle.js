
function Particle (text) {

	this.geometry = createParticlesWithText(text);
	this.position = [];
	this.velocity = [];
	this.current = 0;
	this.size = text.length;

	var array = [];
	for (var i = 0; i < text.length; ++i) array.push(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random());

	this.attachments = [{
		mag: gl.NEAREST,
		min: gl.NEAREST,
		type: gl.FLOAT,
		format: gl.RGBA,
		src: new Float32Array(array)
	}];

	for (var i = 0; i < 2; ++i) this.position.push(twgl.createFramebufferInfo(gl, this.attachments, this.size, 1));
	for (var i = 0; i < 2; ++i) this.velocity.push(twgl.createFramebufferInfo(gl, this.attachments, this.size, 1));

	uniforms.datamap = twgl.createTexture(gl, {
		mag: gl.NEAREST,
		min: gl.NEAREST,
		type: gl.FLOAT,
		format: gl.RGBA,
		width: this.size,
		height: 1,
		src: new Float32Array(array)
	})

	this.update = function () {
		
		uniforms.positionmap = this.position[this.current].attachments[0];
		uniforms.velocitymap = this.velocity[this.current].attachments[0];
		this.current = (this.current+1)%2;
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.velocity[this.current].framebuffer);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.size, 1);
		draw(asset.material['velocity'], asset.geometry['quad'], gl.TRIANGLES);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.position[this.current].framebuffer);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.size, 1);
		draw(asset.material['position'], asset.geometry['quad'], gl.TRIANGLES);
	}
}