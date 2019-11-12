class Module {
  constructor(xOff, yOff, x, y, speed, unit) {
    this.xOff = xOff;
    this.yOff = yOff;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.unit = unit;
    this.xDir = (random()*2 -1.0)*random()*2;
    this.yDir = (random()*2 -1.0)*random()*2;
  }

  // Custom method for updating the variables
  update() {
    this.x = this.x + this.speed * this.xDir;
    this.y = this.y + this.speed * this.yDir;
    if (this.x >= this.unit*random()*20 || this.x <= 0 - random()*20) {
      this.xDir *= -1*random()*1.8;
      this.x = this.x + 1 * this.xDir;
      this.y = this.y + 1 * this.yDir;
    }
    if (this.y >= this.unit*random()*20 || this.y <= 0  - random()*20) {
      this.yDir *= -1*random()*1.8;
      this.y = this.y + 1 * this.yDir;
    }
  }

  // Custom method for drawing the object
  draw() {
    fill(255);
    ellipse(this.xOff + this.x, this.yOff + this.y, 6, 6);
  }
}

let unit = 100;
let count;
let mods = [];

function setup() {
  createCanvas(1000, 1000);
  noStroke();
  let wideCount = width / unit;
  let highCount = height / unit;
  count = wideCount * highCount;

  let index = 0;
  for (let y = 0; y < highCount; y++) {
    for (let x = 0; x < wideCount; x++) {
      mods[index++] = new Module(
        x * unit,
        y * unit,
        unit / 2,
        unit / 2,
        random(0.05, 0.8),
        unit
      );
    }
  }
}

function draw() {
  background(0);
  for (let i = 0; i < count; i++) {
    mods[i].update();
    if (i >= 1 && i%6 != 0)
    {
      stroke(166);
      strokeWeight(1.3*sin(mods[i].x + millis() *.0015));
      line(mods[i].x + mods[i].xOff, mods[i].y + mods[i].yOff, mods[i - 1].x + mods[i - 1].xOff, mods[i - 1].y + mods[i - 1].yOff);
    }
 
    mods[i].draw();
  }
}

function keyReleased()
{
    if(keyCode === ENTER)
    {
        m = month();
        d = day();
        y = year();
        h = hour();
        mi = minute();
        se = second();
        save(y + '.' + m + '.' + d + '_' + h + '.' + mi + '.' + se + '.jpg');
    }

    return false; //need to ahve this for some browsers
}
