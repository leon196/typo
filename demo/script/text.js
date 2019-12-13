
var fontFamily = 'Nunito';
var fontWeight = 'normal';
var fontsize = 1024/10;
var radius = 2;
var cutoff = 0.5;
var tinySDFGenerator = new TinySDF(fontsize, 1024, radius, cutoff, fontFamily, fontWeight);

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!?.,";
var column = 6;
var row = 6;

function createParticlesWithText (text) {
	var positions = [];
	var uvs = [];
	for (var i = 0; i < text.length; i++) {
		var index = alphabet.indexOf(text[i]);
		var x = (index%column)/column;
		var y = Math.floor(index/column)/row;
		positions.push(Math.random()*2.-1., Math.random()*2.-1., Math.random()*2.-1.);
		uvs.push(x, y, i/(text.length-1));
	}

	return twgl.createBufferInfoFromArrays(gl, generateParticles({ position: positions, uv: uvs })[0]);
}

function createFontMap () {
	return twgl.createTexture(gl, {
		mag:gl.LINEAR,
		min:gl.NEAREST_MIPMAP_LINEAR,
		format: gl.LUMINANCE,
		src:tinySDFGenerator.grid(alphabet, column, row)
	});
}

var treetext = 'TREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREETREE';