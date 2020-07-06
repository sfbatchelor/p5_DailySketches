////// SET GLOBAL VARIABLES //////
//--- REQUEST
var key = 'DuMOS0sz2RObRmr8huQakm4SJfCg9qfQeS8LuZEtIwk';
var searchTerm = 'flag';
var pages = 5;
var currentPage = 0;
var url;
//--- RECEIVED DATA
var img = [];   		// images  
var imgUrl = [] ;		// url for images
var croppedUrl = [] ;	// url for cropped images

// Circles 
var circles = [];

// Font
var font;

//// PRELOAD: Execute and finishes completley, before setup is called.
async function preload()
{
    loadImages();
    //load fonts
    font = loadFont('fonts/cour.ttf');
}


async function loadImages()
{
    for (var i = 0; i < pages; i++)
    {
        url = 'https://api.unsplash.com/search/photos?page=1&query=' + searchTerm + '&page=' + (i + 1) + '&client_id=DuMOS0sz2RObRmr8huQakm4SJfCg9qfQeS8LuZEtIwk';
        console.log(url);
        loadJSON(url, gotData);
    }
}

//// GOT DATA: Custom function called when loadJSON() has received a response.
function gotData(data) {
    console.log(data);
    for (let i = 0; i < data.results.length; i++) {
        index = currentPage * 10 +i;
        imgUrl[index] = data.results[i].urls.full;
        croppedUrl[index] = imgUrl[index] + '&crop=entropy&h=1000&w=1000&fit=crop';
        img[index] = loadImage(croppedUrl[index]);
        print(index, "full", imgUrl[index]);
        print(index, "cropped", croppedUrl[index]);
    }
    currentPage++;
}

//// SETUP: Function called to setup the canvas we draw graphics on and set startup variables
function setup() {
    createCanvas(2000, 2180, WEBGL);
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
    drawOverlays();

}

//// DRAW CIRCLES: Encapsulates where and how the circles are drawn.
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
        console.log("finished");
    }
}

//// DRAW OVERLAYS: Encapsulates drawing text and overlay graphics.
function drawOverlays() {


    fontSize = 240;
    textSize(fontSize);
    charWidth = textSize()/1.66;
    charHeight = textSize()/.8

    // draw black fill behind text
    push();
    translate(width / 2. - 200, -height / 2. + 200);
    translate(-10, -170, 1.); //add a z - component because we are in WEBGL mode so text draws ontop of graphics
    fill(0);
    noStroke();
    rect(0, 0, charWidth + 20, 200);
    //draw num pages
    pop();
    push();
    translate(width / 2. - 200, -height / 2. + 200, 2.);
    fill(255, 0, 175);
    textFont(font);
    text(pages, 0, 0);
    pop();

    //draw fill behind text
    for (var i = 0; i < searchTerm.length; i++) {
        push();
        translate(- width / 2., height / 2. - charHeight);
        translate(30, -50, 1.); //add a z - component because we are in WEBGL mode so text draws ontop of graphics
        translate(i * charWidth, 0);
        fill(0);
        noStroke();
        rect(0, 0, charWidth, charHeight);
        pop();
    }

    //search term
    textFont(font);
    push();
    translate(- width/2., height/2.);
    translate(30,  - 130, 2. ); //add a z - component because we are in WEBGL mode so text draws ontop of graphics
    fill(255, 0, 175 );
    text(searchTerm, 0, 0);
    pop();

}


//// KEY RELEASED:  Callback function, exectuted when a key is pressed.
function keyReleased() {
    console.log("Pressed: ", key);
    
    if (keyCode === RETURN) {
        currentPage = 0;
        img = [];   		// images  
        imgUrl = [];		// url for images
        croppedUrl = [];	// url for cropped images
        circles = [];
        circles.push(new Circle(0, 0., min(width, height) / 4.));
        loadImages();

    }
    else if (keyCode === BACKSPACE || keyCode === DELETE) {
        searchTerm = searchTerm.substring(0, searchTerm.length - 1);
    }
    else if ( keyCode === TAB || keyCode === ESCAPE || keyCode === SHIFT || keyCode === CONTROL
        || keyCode === OPTION || keyCode === ALT || key === 'CapsLock') {
            //do nothing
    }
    else if (keyCode === LEFT_ARROW
        || keyCode === RIGHT_ARROW) {
            //change images
            for(const c of circles)
            {
                c.newTexture();
            }
    }
    else if(keyCode === UP_ARROW || keyCode === DOWN_ARROW )
    {
        // change amount of page results with up and down
        if(keyCode == UP_ARROW)
            pages++;
        if(keyCode == DOWN_ARROW)
            pages--;
        // Min and max loop values.
        if (pages > 9)
            pages = 1;
        if (pages < 1)
            pages = 9;
    }
    else {
        if (searchTerm.length < 13)
            searchTerm += key;
    }

    return false; //need to have this for some browsers
}



// Add one circle
function addCircle() {
    // Here's a new circle
    var newCircle = new Circle(random(-width / 2, width / 2.), random(-height / 2., height / 2.), 1);
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

// Check stuck to an edges
Circle.prototype.edges = function() {
  return (this.r > width/2. - abs(this.x) || this.r > abs(this.x) || this.r > height/2. - abs(this.y) || this.r > abs(this.y));
}

// Grow
Circle.prototype.grow = function () {
    this.r += 3.9;
}

// New Texture
Circle.prototype.newTexture = function() {
    this.num = int(random(0, img.length - 1));
}

// Show
Circle.prototype.show = function () {

    fill(255, 0, 175, 10);
    if(img[this.num])
    {
        texture(img[this.num]);
    }
    ellipse(this.x, this.y, this.r * 2, this.r * 2, 50);
    noFill();
    strokeWeight(2.5);
    stroke(255, 0, 175);
    ellipse(this.x, this.y, this.r * 2, this.r * 2, 50);
    fill(50, 50, 50, 10);
    ellipse(this.x, this.y, this.r * 2, this.r * 2, 50);
}