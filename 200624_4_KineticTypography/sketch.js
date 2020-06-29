// SET GLOBAL VARIABLES
var key = 'dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
var searchTerm = 'speculative design';
var articles;
var headline = 'test';

let pg;
var font = "RobertoMono-Regular.ttf";

function setup() {

    createCanvas(500,545);
    createSliders();
    pg = createGraphics(500,545);
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + '&page=' + floor(random(1, 100)) + '&api-key= dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
    loadJSON(url, gotData);


}

function gotData(data)
{
    console.log(data);
    articles = data.response.docs;
    hNum = floor(random(0, articles.length));
    headline = articles[hNum].headline.main;
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


    pg.push();
    if(headline === 'test')
    {
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
    }
    pg.pop();

    //ANIMATION
    for (let y = 0; y < tilesY; y++ ){
        for (let x = 0; x < tilesX; x++) {

      // WARP
      let waveX = int(sin(frameCount * sp.value() + ( x * y ) * dspx.value()) * fct.value());
      let waveY = int(sin(frameCount * sp.value() + ( x * y ) * dspy.value()) * fct.value());

      if (dspx.value() === 0){
          waveX = 0;
      }

      if (dspy.value() === 0){
          waveY = 0;
      }
      
      // image(pg,0,0)
      
      // SOURCE
      let sx = x*tileW + waveX;
      let sy = y*tileH + waveY;
      let sw = tileW;
      let sh = tileH;


      // DESTINATION
      let dx = x*tileW;
      let dy = y*tileH;
      let dw = tileW;
      let dh = tileH;



      copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);



        }
    }


}


function createSliders(){
  tX = createSlider(1, 80, 66, 1);
  tX.position(20, height + 40);
  createP('Tiles X').position(20, height);

  tY = createSlider(1, 80, 36, 1);
  tY.position(20, height + 100);
  createP('Tiles Y').position(20, height+60);

  sp = createSlider(0, 1, 0.005, 0.01);
  sp.position(20, height + 160);
  createP('Speed').position(20, height+120);

  dspx = createSlider(0, 0.1, 0.005, 0.001);
  dspx.position(180, height + 40);
  createP('Displacement X').position(180, height);

  dspy = createSlider(0, 0.2, 0, 0.01);
  dspy.position(180, height + 100);
  createP('Displacement Y').position(180, height+60);

  fct = createSlider(0, 300, 100, 1);
  fct.position(180, height + 160);
  createP('Offset').position(180, height+120);


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
    else if (key === ' ') {
        background(90);
    }

    return false; //need to ahve this for some browsers
}