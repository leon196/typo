
// https://github.com/mapbox/tiny-sdf

'use strict';

var INF = 1e20;

function TinySDF(fontSize, dimension, radius, cutoff, fontFamily, fontWeight) {
    this.fontSize = fontSize || 24;
    this.cutoff = cutoff || 0.25;
    this.fontFamily = fontFamily || 'sans-serif';
    this.fontWeight = fontWeight || 'normal';
    this.radius = radius || 8;
    var size = this.size = dimension;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = size;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;
    // this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'black';

    // temporary arrays for the distance transform
    this.gridOuter = new Float64Array(size * size);
    this.gridInner = new Float64Array(size * size);
    this.f = new Float64Array(size);
    this.z = new Float64Array(size + 1);
    this.v = new Uint16Array(size);

    // hack around https://bugzilla.mozilla.org/show_bug.cgi?id=737852
    this.middle = Math.round((size / 2) * (navigator.userAgent.indexOf('Gecko/') >= 0 ? 1.2 : 1));
}

TinySDF.prototype.line = function (text) {
    this.ctx.clearRect(0, 0, this.size, this.size);
    var lines = text.split('\n');
    for (var l = 0; l < lines.length; ++l) {
        this.ctx.fillText(lines[l], 0, (1+l)*this.fontSize);
    }
}

TinySDF.prototype.grid = function (text, column, row) {
    this.ctx.clearRect(0, 0, this.size, this.size);
    var letter = 0;
    var size = [this.size/column, this.size/row];
    for (var y = 0; y < row; ++y) {
        for (var x = 0; x < column; ++x) {
            if (letter < text.length) {
                this.ctx.fillText(text[letter], x*size[0]+size[0]/2., (y+1)*size[1]-size[0]/4.);
                letter++;
            } else {
                break;
            }
        }
    }
    return this.draw();
}

TinySDF.prototype.draw = function () {

    var imgData = this.ctx.getImageData(0, 0, this.size, this.size);
    var alphaChannel = new Uint8ClampedArray(this.size * this.size);

    for (var i = 0; i < this.size * this.size; i++) {
        var a = imgData.data[i * 4 + 3] / 255; // alpha value
        this.gridOuter[i] = a === 1 ? 0 : a === 0 ? INF : Math.pow(Math.max(0, 0.5 - a), 2);
        this.gridInner[i] = a === 1 ? INF : a === 0 ? 0 : Math.pow(Math.max(0, a - 0.5), 2);
    }

    edt(this.gridOuter, this.size, this.size, this.f, this.v, this.z);
    edt(this.gridInner, this.size, this.size, this.f, this.v, this.z);

    for (i = 0; i < this.size * this.size; i++) {
        var d = Math.sqrt(this.gridOuter[i]) - Math.sqrt(this.gridInner[i]);
        alphaChannel[i] = Math.round(255 - 255 * (d / this.radius + this.cutoff));
    }

    return alphaChannel;
};

// 2D Euclidean squared distance transform by Felzenszwalb & Huttenlocher https://cs.brown.edu/~pff/papers/dt-final.pdf
function edt(data, width, height, f, v, z) {
    for (var x = 0; x < width; x++) edt1d(data, x, width, height, f, v, z);
    for (var y = 0; y < height; y++) edt1d(data, y * width, 1, width, f, v, z);
}

// 1D squared distance transform
function edt1d(grid, offset, stride, length, f, v, z) {
    var q, k, s, r;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;

    for (q = 0; q < length; q++) f[q] = grid[offset + q * stride];

    for (q = 1, k = 0, s = 0; q < length; q++) {
        do {
            r = v[k];
            s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
        } while (s <= z[k] && --k > -1);

        k++;
        v[k] = q;
        z[k] = s;
        z[k + 1] = INF;
    }

    for (q = 0, k = 0; q < length; q++) {
        while (z[k + 1] < q) k++;
        r = v[k];
        grid[offset + q * stride] = f[r] + (q - r) * (q - r);
    }
}
