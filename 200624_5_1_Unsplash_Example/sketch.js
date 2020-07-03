////// SET GLOBAL VARIABLES //////
//--- REQUEST
var key = 'DuMOS0sz2RObRmr8huQakm4SJfCg9qfQeS8LuZEtIwk';
var searchTerm = 'flag';
var numImages = 8;
var url = 'https://api.unsplash.com/search/photos?page=1&query=' + searchTerm + '&client_id=' + key;
//--- RECEIVED DATA
var img = [];   		// images  
var imgUrl = [] ;		// url for images
var croppedUrl = [] ;	// url for cropped images

//// PRELOAD: Execute and finishes completley, before setup is called.
function preload()
{
    loadJSON(url, gotData);
}

//// GOT DATA: Custom function called when loadJSON() has received a response.
function gotData(data) {
    console.log(url);
    console.log(data);
    for (let i = 0; i < numImages; i++) {
        imgUrl[i] = data.results[i].urls.full;
        croppedUrl[i] = imgUrl[i] + '&crop=entropy&h=600&w=1500&fit=crop';
        img[i] = loadImage(imgUrl[i]);
        print(i, "full", imgUrl[i]);
        print(i, "cropped", croppedUrl[i]);
    }
}

//// SETUP: Function called to setup the canvas we draw graphics on and set startup variables
function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < numImages; i++) {
        let newW = width / 4 - (10 * 4);
        img[i].resize(newW, 0);
    }
    noLoop();
}

//// DRAW: The draw loop that is called every frame.
function draw() {
    background(200);
    let pos = createVector(10, 10);
    for (let i = 0; i < numImages; i++) {

        image(img[i], pos.x, pos.y);
        pos.x = pos.x + img[i].width + 10;
        if ((pos.x + img[i].width) > width) {
            pos.x = 10;
            pos.y = pos.y + img[i].height + 10;
        }
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