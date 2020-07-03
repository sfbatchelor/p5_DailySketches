// SET GLOBAL VARIABLES
var key = 'dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
var searchTerm = 'design';
var articles;
var headline = '';
var date = 'loading...';
var abstract = 'loading...';
var web_url = '';
var url_label = '';

let pg;
let pa;
var font = "RobertoMono-Regular.ttf";

function setup() {

    createCanvas(500,545);
    createSliders();
    pg = createGraphics(500,545);
    pa = createGraphics(500,545);
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + '&page=' + floor(random(1, 100)) + '&api-key= dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
    loadJSON(url, gotData);


}

function gotData(data)
{
    console.log(data);
    articles = data.response.docs;
    hNum = floor(random(0, articles.length));
    headline = articles[hNum].headline.main;
    date = articles[hNum].pub_date;
    date = date.split("T")[0];
    abstract = articles[hNum].abstract;
    web_url = articles[hNum].web_url;

    if(web_url.length >= 80)
    {
        url_label = web_url.substring(0, web_url.length - (web_url.length - 80));
        url_label += '...'
    }
    else
        url_label = web_url

    words = headline.split(" ");
    
 }

function draw() {

    background(0);
    // RENDER TEXT
    pg.background(0);
    pg.fill(255);
    pg.textSize(width/5);
    
    let tilesX = tX.value();
    let tilesY = tY.value();

    let tileW = int(width / tilesX);
    let tileH = int(height / tilesY);


    // RENDER DATA HEADLINES
    pg.push();
    if(headline === '')
    {
        pg.fill(0);
        pg.stroke(255);
        pg.text('loading', 50, pg.textSize());
        pg.text(searchTerm, 50, pg.textSize()* 2);
    }
    else
    {
        words = headline.split(" ");
        for(let word = 0 ; word < 5 && word < words.length ; word ++)
        {
            pg.text(words[word], 50, pg.textSize() + pg.textSize()*word);
        }

        //ABSTRACT READER RENDER
        pa.background(0);
        pa.fill(255);
        pa.textSize(width / 18);
        var words = abstract.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,2}\b/g);
        for (let word = 0;  word < words.length; word++) {
            pa.text(words[word], 50, 20+ pa.textSize() + pa.textSize() * word);
        }
    }
    pg.pop();

    //ANIMATION
    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {

            // WARP
            let waveX = int(sin(frameCount * sp.value() + (x * y) * dspx.value()) * fct.value());
            let waveY = int(sin(frameCount * sp.value() + (x * y) * dspy.value()) * fct.value());

            if (dspx.value() === 0) {
                waveX = 0;
            }

            if (dspy.value() === 0) {
                waveY = 0;
            }


            // SOURCE
            let sx = x * tileW + waveX;
            let sy = y * tileH + waveY;
            let sw = tileW;
            let sh = tileH;


            // DESTINATION
            let dx = x * tileW;
            let dy = y * tileH;
            let dw = tileW;
            let dh = tileH;


            copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);

        }
    }

    //ABSTRACT READER OVERLAY
    if(mouseX >= 20 && mouseX <= width-20 && mouseY >= 20 && mouseY <=height-20)
    {
        readerWidth = 450;
        readerHeight = 200;
        sx = mouseX - readerWidth / 2.;
        sy = mouseY - readerHeight / 2.;
        copy(pa, sx, sy, readerWidth, readerHeight, sx, sy, readerWidth, readerHeight);
    }



    //OVERLAYS
    //date
    push();
    translate(width - 25, 10);
    rotate(PI / 2);
    fill(255);
    stroke(255);
    textSize(14);
    text(date, 0, 0);
    pop();
    // bottom line
    stroke(255);
    line(10, height - 20, width - 10, height - 20);
    //cmyk squares
    push();
    translate(width - 25, height - 40);
    fill("#00FFFF")
    stroke("#00FFFF")
    rect(0, 0, 5, 5);
    translate(0, - 10);
    fill("#FF00FF")
    stroke("#FF00FF")
    rect(0, 0, 5, 5);
    translate(0, - 10);
    fill("#FFFF00")
    stroke("#FFFF00")
    rect(0, 0, 5, 5);
    pop();
    //search term
    push();
    translate(10, height - 7);
    fill(255);
    stroke(0);
    text(searchTerm, 0, 0);
    pop();
    push();

    //url
    push();
    translate(width - 25, 100);
    rotate(PI / 2)
    fill(255);
    textSize(8);
    stroke(0);
    text(url_label, 0, 0);
    pop();



}


function createSliders(){
  tX = createSlider(1, 80, 66, 1);
  tX.position(20, height + 40);
  createP('Tiles X').position(20, height);

  tY = createSlider(1, 80, 46, 1);
  tY.position(20, height + 100);
  createP('Tiles Y').position(20, height+60);

  sp = createSlider(0, 1, 0.005, 0.01);
  sp.position(20, height + 160);
  createP('Speed').position(20, height+120);

  dspx = createSlider(0, 0.1, 0.003, 0.001);
  dspx.position(180, height + 40);
  createP('Displacement X').position(180, height);

  dspy = createSlider(0, 0.2, 0, 0.01);
  dspy.position(180, height + 100);
  createP('Displacement Y').position(180, height+60);

  fct = createSlider(0, 300, 100, 1);
  fct.position(180, height + 160);
  createP('Offset').position(180, height+120);


}

function keyPressed()
{
     if(keyCode === RETURN)
     {
         headline = '';
         date = 'loading...';
         abstract = 'loading...'; 
         web_url = '';
         url_label = '';
         var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + '&page=' + floor(random(1, 100)) + '&api-key= dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
         loadJSON(url, gotData);
     }
     else if( keyCode === BACKSPACE )
     {
         searchTerm = searchTerm.substring(0, searchTerm.length - 1);
     }
     else{
         searchTerm += key;
     }

}

//function keyReleased()
//{
//    if(keyCode === ENTER)
//    {
//        m = month();
//        d = day();
//        y = year();
//        h = hour();
//        mi = minute();
//        se = second();
//        save(y + '.' + m + '.' + d + '_' + h + '.' + mi + '.' + se + '.jpg');
//    }
//    else if (key === ' ') {
//        background(90);
//    }
//
//    return false; //need to ahve this for some browsers
//}