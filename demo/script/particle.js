
function Particle (attributes) {

	this.geometry = [];
	this.size = 0;
	for (var i = 0; i < attributes.length; ++i) {
		this.geometry.push(twgl.createBufferInfoFromArrays(gl, attributes[i]));
		this.size += attributes[i].position.length/3/4;
	}
	this.position = [];
	this.velocity = [];
	this.current = 0;
	this.dimension = Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.size)) / Math.log(2)));
	this.uniforms = {
		time: 0,
		positionmap: 0,
		velocitymap: 0,
		datamap: 0,
		size: this.size,
		dimension: this.dimension,
	};

	console.log(this.dimension)
	var array = [];
	for (var i = 0; i < this.dimension*this.dimension; ++i) array.push(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random());

	this.attachments = [{
		mag: gl.NEAREST,
		min: gl.NEAREST,
		type: gl.FLOAT,
		format: gl.RGBA,
		src: new Float32Array(array)
	}];

	for (var i = 0; i < 2; ++i) this.position.push(twgl.createFramebufferInfo(gl, this.attachments, this.dimension, this.dimension));
	for (var i = 0; i < 2; ++i) this.velocity.push(twgl.createFramebufferInfo(gl, this.attachments, this.dimension, this.dimension));

	this.uniforms.datamap = twgl.createTexture(gl, {
		mag: gl.NEAREST,
		min: gl.NEAREST,
		type: gl.FLOAT,
		format: gl.RGBA,
		width: this.dimension,
		height: this.dimension,
		src: new Float32Array(array)
	})

	this.update = function (deltaTime, shaderVelocity, shaderPosition) {
		this.uniforms.time += deltaTime;
		this.uniforms.positionmap = this.position[this.current].attachments[0];
		this.uniforms.velocitymap = this.velocity[this.current].attachments[0];
		this.current = (this.current+1)%2;
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.velocity[this.current].framebuffer);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.dimension, this.dimension);
		gl.useProgram(shaderVelocity.program);
		twgl.setBuffersAndAttributes(gl, shaderVelocity, asset.geometry['screen']);
		twgl.setUniforms(shaderVelocity, this.uniforms);
		twgl.drawBufferInfo(gl, asset.geometry['screen'], gl.TRIANGLES);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.position[this.current].framebuffer);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.dimension, this.dimension);
		gl.useProgram(shaderPosition.program);
		twgl.setBuffersAndAttributes(gl, shaderPosition, asset.geometry['screen']);
		twgl.setUniforms(shaderPosition, this.uniforms);
		twgl.drawBufferInfo(gl, asset.geometry['screen'], gl.TRIANGLES);
	}

	this.draw = function (material) {
		for (var i = 0; i < this.geometry.length; ++i) {
			draw(material, this.geometry[i]);
		}
	}
}