// Leon Denise 
// shaderland

window.onload = function() {

var gl = document.getElementById('canvas').getContext('webgl');
var ext = gl.getExtension('OES_texture_float');
var v3 = twgl.v3;
var m4 = twgl.m4;
var overlay = document.getElementById('overlay');

loadFiles('data/',['eye.ply'], "arraybuffer", function(plys) {
	var plyLoader = new PLYLoader();
	var ply = {};

	Object.keys(plys).forEach(item => {
		ply[item] = plyLoader.parse(plys[item]);
	})

// shaders file to load
loadFiles('shader/',['screen.vert','blur.frag','screen.frag','point.vert','quad.vert','color.frag','circle.frag', 'letter.vert', 'letter.frag', 'position.frag', 'velocity.frag'], "text", function(shaders) {
	var uniforms = {};

	var materials = {};
	var materialMap = {
		'point': 			['point.vert', 			'color.frag'],
		'quad': 			['quad.vert', 			'circle.frag'],
		'letter': 		['letter.vert', 		'letter.frag'],
		'blur': 			['screen.vert', 		'blur.frag'],
		'position': 	['screen.vert', 		'position.frag'],
		'velocity': 	['screen.vert', 		'velocity.frag'],
		'screen': 		['screen.vert', 		'screen.frag'] };

	loadMaterials();

	// var geometry = twgl.createBufferInfoFromArrays(gl, { position: ply['eye.ply'].vertices, color: { data: ply['eye.ply'].colors, numComponents:3 } });
	var attributes = { position: ply['eye.ply'].vertices, color: ply['eye.ply'].colors, normal: ply['eye.ply'].normals };
	attributes = generateParticles(attributes, [1,1])[0];
	Object.keys(attributes).forEach(name => {
		attributes[name] = { data: attributes[name], numComponents:3 };
	});
	var geometry = twgl.createBufferInfoFromArrays(gl, attributes);

	var positions = [];
	var uvs = [];
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var column = 6;
	var row = 6;
	var text = "SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT SALUT";
	for (var i = 0; i < text.length; i++) {
		var index = alphabet.indexOf(text[i]);
		var x = (index%column)/column;
		var y = Math.floor(index/column)/row;
		positions.push(Math.random()*2.-1., Math.random()*2.-1., Math.random()*2.-1.);
		uvs.push(x, y, i/(text.length-1));
	}
	attributes = generateParticles({ position: positions, uv: uvs })[0];
	var geometryLetter = twgl.createBufferInfoFromArrays(gl, attributes);
	var geometryQuad = twgl.createBufferInfoFromArrays(gl, {
		position:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0] });

	// camera
	var projection = m4.identity();
	var camera = m4.identity();
	var cameraDistance = 5;
	var cameraAngle = [0,0];
	var fieldOfView = 60;

	// framebuffers
	var frame = twgl.createFramebufferInfo(gl);
	var frameScreen = twgl.createFramebufferInfo(gl);
	var frameBlurA = twgl.createFramebufferInfo(gl);
	var frameBlurB = twgl.createFramebufferInfo(gl);
	var frameToResize = [frame,frameScreen,frameBlurA,frameBlurB];

	var frameDataBuffer = [];
	var frameVelocity = [];
	var currentFrameData = 0;
	var array = [];
	for (var i = 0; i < text.length; ++i) array.push(positions[i*3], positions[i*3+1], positions[i*3+2], 1)
	var frameAttachments = [{
		mag: gl.NEAREST,
		min: gl.NEAREST,
		type: gl.FLOAT,
		format: gl.RGBA,
	}];
	for (var i = 0; i < 2; ++i) frameDataBuffer.push(twgl.createFramebufferInfo(gl, frameAttachments, text.length,1));
	for (var i = 0; i < 2; ++i) frameVelocity.push(twgl.createFramebufferInfo(gl, frameAttachments, text.length,1));

	// for (var i = 0; i < 2; ++i) twgl.resizeFramebufferInfo(gl, frameDataBuffer[i], frameAttachments, text.length, 1);

	uniforms.datamap = twgl.createTexture(gl, {
		mag: gl.NEAREST,
		min: gl.NEAREST,
		type: gl.FLOAT,
		format: gl.RGBA,
		width: text.length,
		height: 1,
		src: new Float32Array(array),
	})

	var fontsize = 200; // Font size in pixels
	var buffer = 600;    // Whitespace buffer around a glyph in pixels
	var radius = 8;    // How many pixels around the glyph shape to use for encoding distance
	var cutoff = 0.5  // How much of the radius (relative) is used for the inside part the glyph

	var fontFamily = 'Nunito'; // css font-family
	var fontWeight = 'normal';     // css font-weight
	var tinySDFGenerator = new TinySDF(fontsize, buffer, radius, cutoff, fontFamily, fontWeight);

	uniforms.fontmap = twgl.createTexture(gl, {
		mag:gl.NEAREST,
		min:gl.LINEAR,
		format: gl.LUMINANCE,
		// flipY: true,
		src:tinySDFGenerator.grid(alphabet, column, row)
	});

	var timeElapsed = 0;
	uniforms.time = 0;

	function render(elapsed) {
		elapsed /= 1000;
		var deltaTime = elapsed - uniforms.time;
		overlay.innerHTML = Math.ceil(1./deltaTime);
		uniforms.time = elapsed;

		mouse.update();

		if (mouse.clic) {
			cameraAngle[0] += mouse.delta.x * deltaTime / 4.;
			cameraAngle[1] += mouse.delta.y * deltaTime / 4.;
		}

		m4.rotateY(m4.identity(), cameraAngle[0], camera);
		m4.rotateX(camera, cameraAngle[1], camera);
		m4.translate(camera, [0,0,cameraDistance], camera);
		uniforms.viewProjection = m4.multiply(projection, m4.inverse(camera));
		uniforms.camera = m4.getTranslation(camera);

		uniforms.positionmap = frameDataBuffer[currentFrameData].attachments[0];
		uniforms.velocitymap = frameVelocity[currentFrameData].attachments[0];
		currentFrameData = (currentFrameData+1)%2;
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameVelocity[currentFrameData].framebuffer);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, text.length, 1);
		draw(materials['velocity'], geometryQuad, gl.TRIANGLES);
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameDataBuffer[currentFrameData].framebuffer);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, text.length, 1);
		draw(materials['position'], geometryQuad, gl.TRIANGLES);

		// render scene
		gl.bindFramebuffer(gl.FRAMEBUFFER, frame.framebuffer);
  	// gl.enable(gl.DEPTH_TEST);
		// gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.clearColor(0,0,0,1);
		// gl.colorMask(false, false, false, true);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.depthMask(false);
  	gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// draw(materials['quad'], geometry);
		draw(materials['letter'], geometryLetter);

		// gaussian blur
		var iterations = 8;
		var writeBuffer = frameBlurA;
		var readBuffer = frameBlurB;
		for (var i = 0; i < iterations; i++) {
			var radius = (iterations - i - 1)
			if (i === 0) uniforms.frame = frame.attachments[0];
			else uniforms.frame = readBuffer.attachments[0];
			uniforms.flip = true;
			uniforms.direction = i % 2 === 0 ? [radius, 0] : [0, radius];
			drawFrame(materials['blur'], writeBuffer.framebuffer);
			var t = writeBuffer;
			writeBuffer = readBuffer;
			readBuffer = t;
		}

		// final composition
		uniforms.frame = frame.attachments[0];
		uniforms.frameBlur = writeBuffer.attachments[0];
		drawFrame(materials['screen'], null);

		requestAnimationFrame(render);
	}
	function drawFrame(shader, frame) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
		gl.clearColor(0,0,0,0);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		draw(shader, geometryQuad, gl.TRIANGLES);
	}
	function draw(shader, geometry, mode) {
		gl.useProgram(shader.program);
		twgl.setBuffersAndAttributes(gl, shader, geometry);
		twgl.setUniforms(shader, uniforms);
		twgl.drawBufferInfo(gl, geometry, mode);
	}
	function onWindowResize() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);
		for (var index = 0; index < frameToResize.length; ++index)
			twgl.resizeFramebufferInfo(gl, frameToResize[index]);
		uniforms.resolution = [gl.canvas.width, gl.canvas.height];
		projection = m4.perspective(fieldOfView*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.01, 100.0);
	}
	function loadMaterials() {
		Object.keys(materialMap).forEach(function(key) {
			materials[key] = twgl.createProgramInfo(gl,
				[shaders[materialMap[key][0]],shaders[materialMap[key][1]]]); });
	}
	function lerp(v0, v1, t) {
		return v0*(1-t)+v1*t;
	}

	// shader hot-reload
	socket = io('http://localhost:5776');
	socket.on('change', function(data) { 
		if (data.path.includes("demo/shader/")) {
			const url = data.path.substr("demo/shader/".length);
			loadFiles("shader/",[url], "text", function(shade) {
				shaders[url] = shade[url];
				loadMaterials();
			});
		}
	});

	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
	requestAnimationFrame(render);
});
});
}