
import * as THREE from 'three.js';
import assets from './engine/assets';
import Mouse from './engine/mouse';
import Keyboard from './engine/keyboard';
import { engine, initEngine, updateEngine, resizeEngine } from './project/engine';

export default function() {

	assets.load(function() {
		initEngine();
		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', Mouse.onMove, false);
		window.addEventListener('mousedown', Mouse.onClic, false);
		window.addEventListener('mouseup', Mouse.onMouseUp, false);
		window.addEventListener('keydown', Keyboard.onKeyDown, false);
		window.addEventListener('keyup', Keyboard.onKeyUp, false);
		requestAnimationFrame(animate);
	});

	function animate(elapsed) {
		updateEngine(elapsed / 1000);
		requestAnimationFrame(animate);
	}

	function onWindowResize() {
		resizeEngine(window.innerWidth, window.innerHeight);
	}
}
