
import * as THREE from 'three.js';
import * as timeline from '../engine/timeline';
import * as makeText from '../engine/make-text';
import * as TinySDF from 'mapbox/tiny-sdf';
import renderer from '../engine/renderer';
import FrameBuffer from '../engine/framebuffer';
import parameters from '../engine/parameters';
import Geometry from '../engine/geometry';
import Mouse from '../engine/mouse';
import Keyboard from '../engine/keyboard';
import assets from '../engine/assets';
import Bloom from '../libs/bloom/bloom';
import { AnaglyphEffect } from '../libs/AnaglyphEffect';
import { gui } from '../engine/gui';
import { OrbitControls } from '../libs/OrbitControls';
import { uniforms, initUniforms, updateUniforms, resizeUniforms } from './uniform';
import { clamp, lerp, lerpArray, lerpVector, lerpArray2, lerpVectorArray, saturate } from '../engine/misc';

export var engine = {
	camera: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 200),
	target: new THREE.Vector3(),
	scene: null,
	scenerender: null,
	controls: null,
	framebuffer: null,
	frameterrain: null,
	framebiotope: null,
	framecraft: null,
	frametarget: null,
	terraincell: [0,0],
	lastelapsed: 0,
}

export function initEngine () {

	engine.camera.position.x = .1;
	engine.camera.position.y = 15.0;
	engine.camera.position.z = -15.;
	engine.camera.lookAt(engine.target);
	engine.controls = new OrbitControls(engine.camera, renderer.domElement);
	engine.controls.enableDamping = true;
	engine.controls.dampingFactor = 0.1;
	engine.controls.rotateSpeed = 0.1;

	initUniforms();

	engine.scene = new THREE.Scene();
	engine.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,128,128), assets.shaders.terrainplane))
	Geometry.createCircle(Geometry.random(512*512), 5)
	.forEach(geometry => {
		var mesh = new THREE.Mesh(geometry, assets.shaders.fleck);
		mesh.frustumCulled = false;
		engine.scene.add(mesh);
	});
	// Geometry.createCircle(Geometry.random(512*512), 5)
	// .forEach(geometry => {
	// 	var mesh = new THREE.Mesh(geometry, assets.shaders.land);
	// 	mesh.frustumCulled = false;
	// 	engine.scene.add(mesh);
	// });
	// Geometry.create(Geometry.random(512*512)).forEach(geometry => engine.scene.add(new THREE.Mesh(geometry, assets.shaders.grass)));
	engine.scene.add(new THREE.Mesh(new THREE.BoxGeometry(100,100,100), assets.shaders.skybox));
	// Geometry.createCircle(Geometry.random(16*16), 9)
	// .forEach(geometry => engine.scene.add(new THREE.Mesh(geometry, assets.shaders.cloud)));
	// engine.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1), assets.shaders.text))

	// console.log(TinySDF)
	// var tinySDFGenerator = new TinySDF(fontsize, 1024, radius, cutoff, fontFamily, fontWeight);

	var w = window.innerWidth;
	var h = window.innerHeight;
	var options = { format: THREE.RGBAFormat, type: THREE.FloatType };
	engine.frametarget = new THREE.WebGLRenderTarget(w, h, options);
	engine.framebuffer = new FrameBuffer({
		material: assets.shaders.paint
	});
	engine.frameterrain = new FrameBuffer({width: 256*2,height: 256*2,
		material: assets.shaders.terrain,
	});
	engine.framebiotope = new FrameBuffer({ width: 256*2,height: 256*2,
		material: assets.shaders.biotope,
	});
	engine.framecraft = new FrameBuffer({ width: 256*2,height: 256*2,
		material: assets.shaders.craft,
	});

	engine.scenerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
	engine.scenerender.frustumCulled = false;

	uniforms.frametarget = { value: engine.frametarget.texture };
	uniforms.framebuffer = { value: 0 };
	uniforms.terrainmap = { value: 0 };
	uniforms.biotopemap = { value: 0 };
	uniforms.craftmap = { value: 0 };
	uniforms.terraincell = { value: [0,0] };
	uniforms.terraincellID = { value: [0,0] };
	// uniforms.textTexture = { value: makeText.createTexture([{
	// 	text: 'TEXT',
	// 	font: 'kanit',
	// 	textAlign: 'center',
	// 	fontSize: 196,
	// 	fillStyle: 'white',
	// 	textAlign: 'center',
	// 	textBaseline: 'middle',
	// 	width: 1024,
	// 	height: 1024,
	// 	shadowColor: 'rgba(0,0,0,.5)',
	// 	shadowBlur: 4,
	// 	offsetY: 10,
	// }]) };;

	Object.keys(assets.shaders).forEach(key => assets.shaders[key].uniforms = uniforms);
	timeline.start();

	updateTerrain();
}

var array = [0,0,0];

export function updateEngine (elapsed) {
	// elapsed = timeline.getTime();
	engine.controls.update();
	var dt = elapsed-engine.lastelapsed;
	engine.lastelapsed = elapsed;

	updateUniforms(elapsed);

	// array = assets.animations.getPosition('Camera', elapsed);
	// engine.camera.position.set(array[0], array[1], array[2]);

	// engine.camera.fov = 60;
	// engine.camera.updateProjectionMatrix();

	// array = assets.animations.getPosition('CameraTarget', elapsed);
	// engine.target.set(array[0], array[1], array[2]);
	// engine.camera.lookAt(engine.target);
	
	// engine.terraincell[0] = Math.sin(elapsed*.1);
	// engine.terraincell[1] = elapsed*.05;
	engine.controls.enabled = !Keyboard.Space.down;
	if (Keyboard.Space.down) {
	  if (Mouse.down) {
	    Mouse.dtx += (Mouse.x-Mouse.lastx)/10.;
	    Mouse.dty -= (Mouse.y-Mouse.lasty)/10.;
	  }
	}

  Mouse.dtx *= 0.95;
  Mouse.dty *= 0.95;
  Mouse.lastx = Mouse.x;
  Mouse.lasty = Mouse.y;

	engine.terraincell[0] += dt*Mouse.dtx/3.;
	engine.terraincell[1] += dt*Mouse.dty/3.;

	var currentID = [
		Math.floor(engine.terraincell[0]),
		Math.floor(engine.terraincell[1])
	]
	var lastID = [
		Math.floor(uniforms.terraincell.value[0]),
		Math.floor(uniforms.terraincell.value[1])
	]
	var shouldUpdateTerrain = currentID[0] != lastID[0]
		|| currentID[1] != lastID[1];
	uniforms.terraincell.value[0] = engine.terraincell[0];
	uniforms.terraincell.value[1] = engine.terraincell[1];
	uniforms.terraincellID.value[0] = Math.floor(engine.terraincell[0]);
	uniforms.terraincellID.value[1] = Math.floor(engine.terraincell[1]);

	if (shouldUpdateTerrain) {
		updateTerrain();
	}

	renderer.setRenderTarget(engine.frametarget);
	renderer.clear();
	renderer.render(engine.scene, engine.camera);
	renderer.setRenderTarget(null);
	uniforms.framebuffer.value = engine.framebuffer.getTexture();
	engine.framebuffer.update();
	renderer.render(engine.scenerender, engine.camera);
}

function updateTerrain () {
	engine.frameterrain.update();
	uniforms.terrainmap.value = engine.frameterrain.getTexture();
	engine.framebiotope.update();
	uniforms.biotopemap.value = engine.framebiotope.getTexture();
	engine.framecraft.update();
	uniforms.craftmap.value = engine.framecraft.getTexture();
}

export function resizeEngine (width, height)
{
	renderer.setSize(width, height);
	engine.camera.aspect = width/height;
	engine.camera.updateProjectionMatrix();
	engine.frametarget.setSize(width, height);
	engine.framebuffer.setSize(width, height);

	resizeUniforms(width, height);
}

engine.screenshot = function () {

	var w = parameters.debug.renderwidth;
	var h = parameters.debug.renderheight;
	resizeEngine(w, h);

	setTimeout(function(){

    var arr = renderer.domElement.toDataURL().split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) u8arr[n] = bstr.charCodeAt(n);
    var blob = new Blob([u8arr], {type:mime});
    var a = document.createElement("a"), url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "render.png";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);

		resizeEngine(window.innerWidth, window.innerHeight);

	}, 1000 * parameters.debug.renderdelay);
}
