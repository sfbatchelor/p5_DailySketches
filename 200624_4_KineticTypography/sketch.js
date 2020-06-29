// SET GLOBAL VARIABLES
var key = 'dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
var searchTerm = 'speculative design';
var articles;
var headline = 'test';

var font = "RobertoMono-Regular.ttf";

// SET URLs BASED ON INPUTS
function preload()
{

}

async function setup() {
    createCanvas(1000,1080, P2D);
    // START LOADING DATA AND SET TIME INTERVAL TO NOT GET LOCKED OUT
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + '&page=' + floor(random(1, 100)) + '&api-key= dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
    await loadJSON(url, gotData);
    //textFont(font);
    textSize(width/5);
}

async function loadURLs()
{
   await loadJSON(url[itr], gotData);
}

function gotData(data)
{
    console.log(data);
    articles = data.response.docs;
    hNum = floor(random(0, articles.length));
    headline = articles[hNum].headline.main;
    
    createElement('h1', headline);
    createP(articles[hNum].snippet);
 }

function draw() {

    background(100);
    fill(255);
    if(headline === 'test')
        text('WOW', 50, 100);
    else
    {
        words = headline.split(" ");
        for(let word = 0 ; word < 5; word ++)
        {
            text(words[word], 50, textSize() + textSize()*word);
        }
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
    else if (key === ' ') {
        background(90);
    }

    return false; //need to ahve this for some browsers
}