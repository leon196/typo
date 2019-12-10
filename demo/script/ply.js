
var plyLoader = new PLYLoader();

var request = new XMLHttpRequest();
request.open("GET", 'data/mama.ply', true);
request.responseType = "arraybuffer";
request.onload = function(e) {
	console.log(plyLoader.parse(request.response));
}

request.send();