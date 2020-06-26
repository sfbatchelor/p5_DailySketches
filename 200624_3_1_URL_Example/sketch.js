// SET GLOBAL VARIABLES
var yearsBack = 50;
var itr = 0;
var key = 'dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
var searchTerm = 'election';

// SET URLs BASED ON INPUTS
var url =[];
for(var i = 0; i < yearsBack; i++)
{
    url.unshift( 
    'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2019 - i) + '")&api-key=' + key);

}
//console.log(url);

async function setup() {
    noCanvas();
    // START LOADING DATA AND SET TIME INTERVAL TO NOT GET LOCKED OUT
    await loadJSON(url[itr], gotData);
    pullData = setInterval(function(){ loadURLs(); }, 6000);
}

async function loadURLs()
{
   await loadJSON(url[itr], gotData);

}

function gotData(data)
{
    //console.log(url);
    //console.log(data);
    var frequency = data.response.meta.hits;
    console.log("'" + searchTerm + "' in year " + (2020 - yearsBack + itr) + ": " + frequency);
    var articles = data.response.docs;
    for(var i = 0; i < articles.length; i++)
    {
        createElement('h1', articles[i].headline.main);
        createP(articles[i].snippet);
    }
    itr++;
 }

function draw() {
   if(itr+1 > url.length)
        clearInterval(pullData);
  
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