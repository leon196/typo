// Leon Denise 
// typo

window.onload = function() {

	var camera = m4.identity();
	var cameraDistance = 2;
	var cameraAngle = [0,0];
	var fieldOfView = 50;
	var projection = m4.identity();

	var frame = twgl.createFramebufferInfo(gl);
	var particleTree, particleLiquid;
	var blur = new Blur();
	var ready = false;

	var timeElapsed = 0;
	uniforms.time = 0;
	uniforms.fontmap = createFontMap();

	function init () {
		particleTree = new Particle(createParticlesWithText(treetext));
		particleLiquid = new Particle(createParticlesWithText(liquidtext));
		ready = true;
	}

	function render (elapsed) {
		elapsed /= 1000;
		var deltaTime = elapsed - uniforms.time;
		uniforms.time = elapsed;

		mouse.update();
		if (mouse.clic) {
			cameraAngle[0] += mouse.delta.x * deltaTime / 4.;
			cameraAngle[1] += mouse.delta.y * deltaTime / 4.;
		}

		m4.rotateY(m4.translation([0,-.2,0]), cameraAngle[0], camera);
		m4.rotateX(camera, cameraAngle[1], camera);
		m4.translate(camera, [0,0,cameraDistance], camera);
		uniforms.viewProjection = m4.multiply(projection, m4.inverse(camera));
		uniforms.camera = m4.getTranslation(camera);
		
		if (asset.loaded) {
			if (!ready) init();


			particleTree.update(deltaTime, asset.material['velocity'], asset.material['position']);
			particleLiquid.update(deltaTime, asset.material['liquidV'], asset.material['liquidP']);

			gl.bindFramebuffer(gl.FRAMEBUFFER, frame.framebuffer);
			gl.clearColor(0,0,0,1);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
			gl.depthMask(false);
	  	gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			// uniforms.positionmap = particleTree.uniforms.positionmap;
			// uniforms.velocitymap = particleTree.uniforms.velocitymap;
			// uniforms.datamap = particleTree.uniforms.datamap;
			// particleTree.draw(asset.material['letter']);

			gl.depthMask(true);
	  	gl.enable(gl.DEPTH_TEST);
	  	gl.disable(gl.BLEND);
			uniforms.positionmap = particleLiquid.uniforms.positionmap;
			uniforms.velocitymap = particleLiquid.uniforms.velocitymap;
			uniforms.datamap = particleLiquid.uniforms.datamap;
			uniforms.size = particleLiquid.size;
			uniforms.dimension = particleLiquid.dimension;
			particleLiquid.draw(asset.material['liquidS']);

			blur.update(frame);
			uniforms.frame = frame.attachments[0];
			uniforms.frameBlur = blur.write.attachments[0];
			drawFrame(asset.material['screen'], null);
		}

		requestAnimationFrame(render);
	}

	function onWindowResize() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);
		twgl.resizeFramebufferInfo(gl, frame);
		projection = m4.perspective(fieldOfView*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.01, 100.0);
		uniforms.resolution = [gl.canvas.width, gl.canvas.height];
		blur.resize();
	}

	function lerp(v0, v1, t) {
		return v0*(1-t)+v1*t;
	}

	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
	requestAnimationFrame(render);
	asset.load();
}