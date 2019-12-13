
var gl = document.getElementById('canvas').getContext('webgl');

var asset = {};
var uniforms = {};

asset.meshes = {};
asset.material = {};
asset.shaders = {};
asset.loaded = false;

asset.shaderList = [
	'screen.vert',
	'blur.frag',
	'screen.frag',
	'point.vert',
	'quad.vert',
	'color.frag',
	'circle.frag',
	'letter.vert',
	'letter.frag',
	'position.frag',
	'velocity.frag',
	'tree.vert',
];

asset.materialMap = {
	'point': 			['point.vert', 			'color.frag'],
	'quad': 			['quad.vert', 			'circle.frag'],
	'letter': 		['letter.vert', 		'letter.frag'],
	'tree': 			['tree.vert', 			'letter.frag'],
	'blur': 			['screen.vert', 		'blur.frag'],
	'position': 	['screen.vert', 		'position.frag'],
	'velocity': 	['screen.vert', 		'velocity.frag'],
	'screen': 		['screen.vert', 		'screen.frag'] };

asset.meshesList = [
	'eye.ply',
];

asset.geometry = {
	'quad': twgl.createBufferInfoFromArrays(gl, { position:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0] }),
};

// var attributes = { position: ply['eye.ply'].vertices, color: ply['eye.ply'].colors, normal: ply['eye.ply'].normals };
// attributes = generateParticles(attributes, [1,1])[0];
// Object.keys(attributes).forEach(name => {
// 	attributes[name] = { data: attributes[name], numComponents:3 };
// });
// var geometry = twgl.createBufferInfoFromArrays(gl, attributes);

asset.load = function () {
	loadFiles('data/', asset.meshesList, "arraybuffer", function(data) {
		var plyLoader = new PLYLoader();
		Object.keys(data).forEach(item => { asset.meshes[item] = plyLoader.parse(data[item]); })
		asset.check();
	}, function(ratio, name){
		// console.log(ratio, name);
	});

	loadFiles('shader/', asset.shaderList, "text", function(data) {
		asset.shaders = data;
		asset.loadMaterials();
		asset.check();
	}, function(ratio, name){
		// console.log(ratio, name);
	});
}

asset.check = function () {
	asset.loaded = 	Object.keys(asset.shaders).length == asset.shaderList.length &&
									Object.keys(asset.meshes).length == asset.meshesList.length;
}

asset.loadMaterials = function () {
	Object.keys(asset.materialMap).forEach(function(key) {
		asset.material[key] = twgl.createProgramInfo(gl, [ asset.shaders[ asset.materialMap[key][0] ], asset.shaders[ asset.materialMap[key][1] ] ]);
	});
}

// shader hot-reload
socket = io('http://localhost:5776');
socket.on('change', function(data) { 
	if (data.path.includes("demo/shader/")) {
		const url = data.path.substr("demo/shader/".length);
		loadFiles("shader/",[url], "text", function(shade) {
			asset.shaders[url] = shade[url];
			loadMaterials();
		});
	}
});