var itr = 0;
var key = 'dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
var searchTerm = 'election';
var url =[
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2000) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2001) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2002) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2003) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2004) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2005) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2006) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2007) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2008) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2009) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2010) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2011) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2012) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2013) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2014) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2015) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2016) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2017) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2018) + '")&api-key=' + key,
 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2019) + '")&api-key=' + key,
]

async function setup() {
    noCanvas();
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
    console.log("'"+ searchTerm + "' in year " +  (2000+itr) +": " + frequency);
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