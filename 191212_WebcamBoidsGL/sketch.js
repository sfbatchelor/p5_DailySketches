flock = [];

let alignmentSlider, cohesionSlider, separationSlider;
let pause = true;

function setup() {
    createCanvas(1080, 1080, WEBGL);
    //ortho(-width, width, height, -height / 2, 0.1, 100);
    console.log('hello');
    video = createCapture(VIDEO);
    setAttributes('alpha',1);
    background(0);



    alignmentSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1, 0.1);

    respawnBoids();
}

function draw() {

    push();
    translate(-width / 2, -height / 2);
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


function keyReleased() {
    if (keyCode === ENTER) {
        m = month();
        d = day();
        y = year();
        h = hour();
        mi = minute();
        se = second();
        save(y + '.' + m + '.' + d + '_' + h + '.' + mi + '.' + se + '.jpg');
    }
    if (key === 'R') {
        respawnBoids();
    }
    if (key === ' ') {
        pause = !pause;
    } else if (keyCode === SHIFT) {
        background(0);
    }

    return false; //need to ahve this for some browsers
}

function respawnBoids() {

    flock = [];
    video.loadPixels();
    still = video.get(0, 0, video.width, video.height);
    if (still.width > 0) {
        still.loadPixels();
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let x = int(random(0, video.width));
                let y = int(random(0, video.height));
                let index = (x + y * still.width) * 4
                flock.push(new Boid(color(still.pixels[index], still.pixels[index + 1], still.pixels[index + 2])));
                console.log('captured', x, y);
            }
        }
    } else {

        for (let i = 0; i < 30; i++) {
            flock.push(new Boid(color(255, 0, 0)));
        }
    }
}