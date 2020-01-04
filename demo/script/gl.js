
var v3 = twgl.v3;
var m4 = twgl.m4;
var gl = document.getElementById('canvas').getContext('webgl');
var ext = gl.getExtension('OES_texture_float');
var geometryScreen = twgl.createBufferInfoFromArrays(gl, { position:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0] });

var uniforms = {};

function drawFrame(shader, frame) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
	gl.clearColor(0,0,0,0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	draw(shader, geometryScreen, gl.TRIANGLES);
}

function draw(shader, geometry, mode) {
	gl.useProgram(shader.program);
	twgl.setBuffersAndAttributes(gl, shader, geometry);
	twgl.setUniforms(shader, uniforms);
	twgl.drawBufferInfo(gl, geometry, mode);
}