const flock = [];

let alignmentSlider, cohesionSlider, separationSlider;
let pause = true;

function setup() {
    createCanvas(1080, 1080);
    console.log('hello');
    background(0);
    alignmentSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1, 0.1);

    for (let i = 0; i < 100; i++) {
        flock.push(new Boid());
    }
}

function draw() {

    for (let boid of flock) {
        boid.edges();
        if (pause === true) {
            boid.flock(flock);
            boid.update();
        }
        boid.show();
    }

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
    if (key === ' ') {
        pause = !pause;
    }
    else if (keyCode === SHIFT) {
        background(0);
    }

    return false; //need to ahve this for some browsers
}