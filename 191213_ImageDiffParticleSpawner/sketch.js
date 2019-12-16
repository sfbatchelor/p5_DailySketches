//Edited from: https://kylemcdonald.github.io/cv-examples/

//capture
var capture;
var diffImage;
var previousPixels;
var captureW = 960;
var captureH = 540;
var recaptureBG = true;
var canvasW = captureH * 5; //portrait capture setup
var canvasH = captureW;
var total = 0;


//graphics
let alignmentSlider, cohesionSlider, separationSlider;
flock = [];
var pause = true;

function setup() {
    createCanvas(canvasW, canvasH, WEBGL);
    capture = createCapture(VIDEO);
    diffImage = createCapture(VIDEO);
    capture.elt.setAttribute('playsinline', '');
    capture.size(captureW, captureH);
    capture.hide();
    diffImage.hide();
    setAttributes('alpha', 1);
    background(0);




    alignmentSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1, 0.1);

    respawnBoids();

}

function copyImage(src, dst) {
    var n = src.length;
    if (!dst || dst.length != n) dst = new src.constructor(n);
    while (n--) dst[n] = src[n];
    return dst;
}

function processCapture() {
    capture.loadPixels();
    if (recaptureBG) {
        previousPixels = copyImage(capture.pixels, previousPixels);
        recaptureBG = false;
    }
    total = 0;
    if (capture.pixels.length > 0) { // don't forget this!
        if (previousPixels) {
            var w = capture.width,
                h = capture.height;
            var i = 0;
            var thresholdAmount = select('#thresholdAmount').value() * 255. / 500.;
            thresholdAmount *= 3; // 3 for r, g, b
            diffImage = capture.get(0, 0, captureW, captureH);
            diffImage.loadPixels();
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    // calculate the differences
                    var rdiff = Math.abs(capture.pixels[i + 0] - previousPixels[i + 0]);
                    var gdiff = Math.abs(capture.pixels[i + 1] - previousPixels[i + 1]);
                    var bdiff = Math.abs(capture.pixels[i + 2] - previousPixels[i + 2]);
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
                        diffImage.pixels[i++] = output;
                        diffImage.pixels[i++] = 255;
                        diffImage.pixels[i++] = output;
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
    diffImage.updatePixels();


}

function drawCapture() {

    select('#motion').elt.innerText = total;
    //draw diff-image
    push();
    translate(-captureH, 0);
    rotate(radians(-90)); //rotate for portrait
    texture(diffImage);
    plane(captureW, captureH);
    pop();
    //draw capture
    push();
    translate(-captureH * 2, 0);
    rotate(radians(-90)); //rotate for portrait
    texture(capture);
    plane(captureW, captureH);
    pop();


}

function draw() {

    processCapture();
    drawCapture();

    push();
    translate(0, height/2);
    rotate(radians(-90)); //rotate for portrait
    for (let boid of flock) {
        boid.edges();
        if (pause === true) {
            boid.flock(flock);
            boid.update();
            boid.show();
        }
    }

    pop();

}


function respawnBoids() {

    flock = [];
    if (diffImage.width > 0) {
        diffImage.loadPixels();
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let x = int(random(0, diffImage.width));
                let y = int(random(0, diffImage.height));
                let index = (x + y * diffImage.width) * 4
                while (diffImage.pixels[index] === 0 && diffImage.pixels[index + 1] === 255 && diffImage.pixels[index + 2] === 0) {
                    x = int(random(0, diffImage.width));
                    y = int(random(0, diffImage.height));
                    index = (x + y * diffImage.width) * 4
                }
                flock.push(new Boid(x, y, color(diffImage.pixels[index], diffImage.pixels[index + 1], diffImage.pixels[index + 2])));
                console.log('captured', x, y);
            }
        }
    } else {

        for (let i = 0; i < 30; i++) {
            flock.push(new Boid(random(-captureW, captureW) / 2, random(-captureH, captureH) / 2, color(255, 0, 0)));
        }
    }
}

function keyReleased() {
    if (key === 'X') {
        recaptureBG = true;
    }
    if (keyCode === ENTER) {
        m = month();
        d = day();
        y = year();
        h = hour();
        mi = minute();
        se = second();
        save(y + '.' + m + '.' + d + '_' + h + '.' + mi + '.' + se + '.png');
    }
    if (key === 'R') {
        respawnBoids();
    }
    if (key === ' ') {
        pause = !pause;
    } else if (keyCode === SHIFT) {
        background(0);
    }


}