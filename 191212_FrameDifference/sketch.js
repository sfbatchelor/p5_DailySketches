//Edited from: https://kylemcdonald.github.io/cv-examples/

var capture;
var previousPixels;
var w = 960;
var h = 540;
var recaptureBG = true;
var canvasW = h*2; //portrait capture setup
var canvasH = w;

function setup() {
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function () {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    capture.size(w, h);
    createCanvas(canvasW, canvasH);
    capture.hide();
}

function copyImage(src, dst) {
    var n = src.length;
    if (!dst || dst.length != n) dst = new src.constructor(n);
    while (n--) dst[n] = src[n];
    return dst;
}

function draw() {
    capture.loadPixels();
    if (recaptureBG) {
        previousPixels = copyImage(capture.pixels, previousPixels);
        recaptureBG = false;
    }
    var total = 0;
    if (capture.pixels.length > 0) { // don't forget this!
        if (previousPixels) {
            var w = capture.width,
                h = capture.height;
            var i = 0;
            var pixels = capture.pixels;
            var thresholdAmount = select('#thresholdAmount').value() * 255. / 300.;
            thresholdAmount *= 3; // 3 for r, g, b
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    // calculate the differences
                    var rdiff = Math.abs(pixels[i + 0] - previousPixels[i + 0]);
                    var gdiff = Math.abs(pixels[i + 1] - previousPixels[i + 1]);
                    var bdiff = Math.abs(pixels[i + 2] - previousPixels[i + 2]);
                    // copy the current pixels to previousPixels
                    //                    previousPixels[i + 0] = pixels[i + 0];
                    //                    previousPixels[i + 1] = pixels[i + 1];
                    //                    previousPixels[i + 2] = pixels[i + 2];
                    var diffs = rdiff + gdiff + bdiff;
                    var output = 0;
                    if (rdiff > thresholdAmount || gdiff > thresholdAmount || bdiff > thresholdAmount) {
                        output = 255;
                        total += diffs;
                        i += 3;
                    } else {
                        pixels[i++] = output;
                        pixels[i++] = output;
                        pixels[i++] = output;
                    }

                    // also try this:
                    // pixels[i++] = rdiff;
                    // pixels[i++] = gdiff;
                    // pixels[i++] = bdiff;
                    i++; // skip alpha
                }
            }
        }
    }
    // need this because sometimes the frames are repeated

    select('#motion').elt.innerText = total;
    capture.updatePixels();
    //draw diff-image
    push();
    translate(h, w);
    rotate(radians(-90)); //rotate for portrait
    image(capture, 0, 0, w, h);
    pop();
    //draw capture
    push();
    translate(0, w);
    rotate(radians(-90)); //rotate for portrait
    capture.loadPixels();
    image(capture, 0, 0, w, h);
    pop();

}

function keyTyped() {
    if (key === 'x') {
        recaptureBG = true;
    }
}