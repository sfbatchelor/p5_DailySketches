////// SET GLOBAL VARIABLES //////
//--- REQUEST
var key = 'DuMOS0sz2RObRmr8huQakm4SJfCg9qfQeS8LuZEtIwk';
var searchTerm = 'flag';
var pages = 7;
var currentPage = 0;
var url;
//--- RECEIVED DATA
var img = [];   		// images  
var imgUrl = [] ;		// url for images
var croppedUrl = [] ;	// url for cropped images

// Circles 
var circles = [];

//// PRELOAD: Execute and finishes completley, before setup is called.
async function preload()
{
    for (var i = 0; i < pages; i++)
    {
        url = 'https://api.unsplash.com/search/photos?page=1&query=' + searchTerm + '&page=' + (i + 1) + '&client_id=DuMOS0sz2RObRmr8huQakm4SJfCg9qfQeS8LuZEtIwk';
        console.log(url);
        await loadJSON(url, gotData);
    }
}

//// GOT DATA: Custom function called when loadJSON() has received a response.
function gotData(data) {
    console.log(data);
    for (let i = 0; i < data.results.length; i++) {
        index = currentPage * 10 +i;
        imgUrl[index] = data.results[i].urls.full;
        croppedUrl[index] = imgUrl[index] + '&crop=entropy&h=600&w=1500&fit=crop';
        img[index] = loadImage(imgUrl[index]);
        print(index, "full", imgUrl[index]);
        print(index, "cropped", croppedUrl[index]);
    }
    currentPage++;
}

//// SETUP: Function called to setup the canvas we draw graphics on and set startup variables
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    for (let i = 0; i < img.length; i++) {
        let newW = width / 4 - (10 * 4);
        console.log("Resizeing " + i);
        img[i].resize(newW, 0);
    }

    circles.push(new Circle(0, 0., min(width, height) / 4.));
}

//// DRAW: The draw loop that is called every frame.
function draw() {
    background(50);
    drawCircles();

}


function drawCircles() {


    // All the circles
    for (var i = 0; i < circles.length; i++) {
        var c = circles[i];
        c.show();

        // Is it a growing one?
        if (c.growing) {
            c.grow();
            // Does it overlap any previous circles?
            for (var j = 0; j < circles.length; j++) {
                var other = circles[j];
                if (other != c) {
                    var d = dist(c.x, c.y, other.x, other.y);
                    if (d - 1 < c.r + other.r) {
                        c.growing = false;
                    }
                }
            }

            // Is it stuck to an edge?
            if (c.growing) {
                c.growing = !c.edges();
            }
        }
    }

    // Let's try to make a certain number of new circles each frame
    // More later
    var target = 1 + constrain(floor(frameCount / 120), 0, 20);
    // How many
    var count = 0;
    // Try N times
    for (var i = 0; i < 1000; i++) {
        if (addCircle()) {
            count++;
        }
        // We made enough
        if (count == target) {
            break;
        }
    }

    // We can't make any more
    if (count < 1) {
        noLoop();
        console.log("finished");
    }
}


//// KEY RELEASED:  Callback function, exectuted when a key is released.
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
    else if (key === ' ') {
        background(90);
    }

    return false; //need to ahve this for some browsers
}


// Add one circle
function addCircle() {
  // Here's a new circle
  var newCircle = new Circle(random(-width/2, width/2.), random(-height/2., height/2.), 1);
  // Is it in an ok spot?
  for (var i = 0; i < circles.length; i++) {
    var other = circles[i];
    var d = dist(newCircle.x, newCircle.y, other.x, other.y);
    if (d < other.r + 4) {
      newCircle = undefined;
      break;
    }
  }
  // If it is, add it
  if (newCircle) {
    circles.push(newCircle);
    return true;
  } else {
    return false;
  }
}

// Circle object
function Circle(x, y, r) {
  this.growing = true;
  this.x = x;
  this.y = y;
  this.r = r;
  this.num = int(random(0, img.length -1));
}

// Check stuck to an edge
Circle.prototype.edges = function() {
  return (this.r > width/2. - abs(this.x) || this.r > abs(this.x) || this.r > height/2. - abs(this.y) || this.r > abs(this.y));
}

// Grow
Circle.prototype.grow = function () {
    this.r += 0.5;
}

// Show
Circle.prototype.show = function () {
    fill(255, 0, 175, 225);
    texture(img[this.num]);
    ellipse(this.x, this.y, this.r * 2, this.r * 2, 50);
    noFill();
    strokeWeight(2.5);
    stroke(255, 0, 175, 225);
    ellipse(this.x, this.y, this.r * 2, this.r * 2, 50);
}