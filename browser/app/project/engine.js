
import * as THREE from 'three.js';
import * as timeline from '../engine/timeline';
import * as makeText from '../engine/make-text';
import * as TinySDF from 'mapbox/tiny-sdf';
import renderer from '../engine/renderer';
import FrameBuffer from '../engine/framebuffer';
import parameters from '../engine/parameters';
import Geometry from '../engine/geometry';
import assets from '../engine/assets';
import Bloom from '../libs/bloom/bloom';
import { AnaglyphEffect } from '../libs/AnaglyphEffect';
import { gui } from '../engine/gui';
import { OrbitControls } from '../libs/OrbitControls';
import { uniforms, initUniforms, updateUniforms, resizeUniforms } from './uniform';
import { clamp, lerp, lerpArray, lerpVector, lerpArray2, lerpVectorArray, saturate } from '../engine/misc';

export var engine = {
	camera: new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 1000),
	target: new THREE.Vector3(),
	scene: null,
	sceneedge: null,
	scenerender: null,
	controls: null,
	framebuffer: null,
	frametarget: null,
	framebloom: null,
	frameedge: null,
	anaglyph: null,
	bloom: null,
}

export function initEngine () {

	engine.camera.position.x = 0.02;
	engine.camera.position.y = -0.05;
	engine.camera.position.z = 2.0;
	// engine.controls = new OrbitControls(engine.camera, renderer.domElement);
	// engine.controls.enableDamping = true;
	// engine.controls.dampingFactor = 0.1;
	// engine.controls.rotateSpeed = 0.1;

	initUniforms();

	engine.scene = new THREE.Scene();
	Geometry.create(Geometry.random(1000), [6,6]).forEach(geometry =>
		engine.scene.add(new THREE.Mesh(geometry, assets.shaders.quad)));
	engine.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1), assets.shaders.text))

	console.log(TinySDF)
	// var tinySDFGenerator = new TinySDF(fontsize, 1024, radius, cutoff, fontFamily, fontWeight);


	engine.frametarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
		format: THREE.RGBAFormat,
		type: THREE.FloatType});
	engine.framebloom = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
		format: THREE.RGBAFormat,
		type: THREE.FloatType});
	engine.frameedge = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
		format: THREE.RGBAFormat,
		type: THREE.FloatType});
	engine.bloom = new Bloom(engine.frameedge.texture);

	engine.sceneedge = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.edge);
	engine.sceneedge.frustumCulled = false;
	engine.scenerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
	engine.scenerender.frustumCulled = false;

	uniforms.frametarget = {value: engine.frametarget.texture};
	uniforms.frameedge = {value: engine.frameedge.texture};
	uniforms.framebloom = {value: engine.framebloom.texture};
	uniforms.blur = {value: engine.bloom.blurTarget.texture};
	uniforms.bloom = {value: engine.bloom.bloomTarget.texture};

	uniforms.textTexture = { value: makeText.createTexture([{
		text: 'TEXT',
		font: 'kanit',
		textAlign: 'center',
		fontSize: 196,
		fillStyle: 'white',
		textAlign: 'center',
		textBaseline: 'middle',
		width: 1024,
		height: 1024,
		shadowColor: 'rgba(0,0,0,.5)',
		shadowBlur: 4,
		offsetY: 10,
	}]) };;

	Object.keys(assets.shaders).forEach(key => assets.shaders[key].uniforms = uniforms);
	timeline.start();
}

var array = [0,0,0];

export function updateEngine (elapsed) {
	elapsed = timeline.getTime();
	// engine.controls.update();
	updateUniforms(elapsed);

	array = assets.animations.getPosition('Camera', elapsed);
	engine.camera.position.set(array[0], array[1], array[2]);

	engine.camera.fov = 60 + assets.animations.getPosition('ExtraFOV', elapsed)[1];
	engine.camera.updateProjectionMatrix();

	array = assets.animations.getPosition('CameraTarget', elapsed);
	engine.target.set(array[0], array[1], array[2]);
	engine.camera.lookAt(engine.target);

	renderer.clear();
	renderer.setRenderTarget(engine.frametarget);
	renderer.render(engine.scene, engine.camera);
	renderer.setRenderTarget(engine.frameedge);
	renderer.render(engine.sceneedge, engine.camera);
	renderer.setRenderTarget(null);
	engine.bloom.render(renderer);
	renderer.render(engine.scenerender, engine.camera);
}

export function resizeEngine (width, height)
{
	renderer.setSize(width, height);
	engine.camera.aspect = width/height;
	engine.camera.updateProjectionMatrix();
	engine.frametarget.setSize(width, height);
	engine.framebloom.setSize(width, height);
	engine.frameedge.setSize(width, height);
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
