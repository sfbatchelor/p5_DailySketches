// SET GLOBAL VARIABLES
//tree
let treeBase;
let treeMax;
let treeMin;
let branchHeightStart;
let branchXRange = 300;
let branchYRange = 100;
let maxLeaves = 10;
let minLeaves = 1;
let leafRange = 200;
let leafMaxWidth= 20;
let leafMaxHeight = 20;
let maxWind = 200;
let windFrequencyX = 0.0003;
let windFrequencyY = 0.0001;
//search
var yearsBack = 30;
var itr = 0;
var key = 'dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2';
var searchTerm = 'war';
//data 
var termFrequencyData = new Map();
var minFreq = 10000000000000;
var maxFreq = 0;
var totalFreq = 0.
var avgFreq = 0.

const map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// SET URLs BASED ON INPUTS
var url =[];
function genURLs(){

    for (var i = 0; i < yearsBack; i++) {
        url.unshift(
            'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + searchTerm + ' AND pub_year:("' + (2019 - i) + '")&api-key=dsmqvW3GMsp2GJ4mho31MPjGJxxGNdD2');

    }
}
genURLs();

async function setup() {
    createCanvas(2000, 1000);
    console.log('hello');
    colorMode(HSB, 100);
    background(90);
    treeBase  = {
                x :  width/2.,
                y : height - 120,
            };
    treeMin = {
        x: 100,
        y: height - 300
    };
    treeMax = {
        x: width/2 ,
        y: 160
    };



    // START LOADING DATA AND SET TIME INTERVAL TO NOT GET LOCKED OUT
    await loadJSON(url[itr], gotData);
    pullData = setInterval(function(){ loadURLs(); }, 7000)

 
}

async function loadURLs()
{
   await loadJSON(url[itr], gotData);

}

function gotData(data)
{
    var frequency = data.response.meta.hits;
    console.log("'" + searchTerm + "' in year " + (2020 - yearsBack + itr) + ": " + frequency);
    termFrequencyData.set((2020 - yearsBack + itr),frequency);

    if(frequency > maxFreq)
        maxFreq = frequency;
    else if ( frequency < minFreq)
        minFreq = frequency;
    totalFreq += frequency;
    avgFreq = totalFreq/(itr+1.);


    console.log(termFrequencyData);
    console.log(minFreq);
    console.log(maxFreq);
    var articles = data.response.docs;
    itr++;
 }

function draw() {

    colorMode(HSB, 100);
    background(90);
    drawDataTree();
    if (itr + 1 > url.length)
        clearInterval(pullData);

    // OVERLAYS
    // search term
    textSize(width / 65);
    fill(20);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont('Times New Roman');
    textStyle(ITALIC);
    text("\" " + searchTerm + " \"", width / 2., height - 40);
    //years on bottom
    for (let [key, value] of termFrequencyData) {
        textSize(width / 175);
        xpos = map(key, 2020 - yearsBack, 2020, treeMin.x, treeMax.x);
        ellipse(xpos, height -95, 3, 3);
        text(key, xpos, height - 80);
        xpos = width - xpos;
        ellipse(xpos, height -95, 3, 3);
        text(key, xpos, height - 80);
    }
    // values on side
    ypos = map(maxFreq, minFreq, maxFreq, treeMin.y, treeMax.y);
    push();
    translate(30, ypos);
    rotate(PI / 2.);
    text(maxFreq, 0, 0);
    pop();
    push();
    translate(width - 30, ypos);
    rotate(-PI / 2.);
    text(maxFreq, 0, 0);
    pop();
    ypos = map(minFreq, minFreq, maxFreq, treeMin.y, treeMax.y);
    push();
    translate(30, ypos);
    rotate(PI / 2.);
    text(minFreq, 0, 0);
    pop();
    push();
    translate(width - 30, ypos);
    rotate(-PI / 2.);
    text(minFreq, 0, 0);
    pop();

    //corner dashes
    push();
    translate(20, 20);
    stroke(0);
    line(-5, 0, 5, 0);
    pop();

    push();
    translate(width - 20, 20);
    stroke(0);
    line(-5, 0, 5, 0);
    pop();

    push();
    translate(width - 20, height - 20);
    stroke(0);
    line(-5, 0, 5, 0);
    pop();

    push();
    translate(20, height - 20);
    stroke(0);
    line(-5, 0, 5, 0);
    pop();
}

function drawDataTree() {
    var order = 1;
    for (let [key, value] of termFrequencyData) {
        // MAP: freq to Y, year to X
        // find out where the branch end goes.
        //console.log(key + ' = ' + value)

        //push away if close to average
        endY =  map(value, minFreq, maxFreq, treeMin.y, treeMax.y);
        endX = map(key, 2020 - yearsBack, 2020, treeMin.x, treeMax.x);

        //find out where the control points go
        c1 = {
            x: endX + 40,
            y: endY + 500
        };
        c2 = {
            x: treeBase.x,
            y: treeMin.y - 1500 
        };

        branchAlpha = 15;
        leafAlpha = 70+ 50*constrain(order/(yearsBack/2),0., 1.); //bring alpha to 50% but have the outer be almost translucent
        windXLeft = noise(windFrequencyX * millis() + endX) * maxWind;
        windXLeft = windXLeft - maxWind / 2.;
        windY = noise(windFrequencyY * millis() + endY) * maxWind;
        windY = windY - maxWind / 2.;
        windXRight = noise(windFrequencyX * millis() + width - endX) * maxWind;
        windXRight = windXRight - maxWind / 2.;


        // draw branch
        noFill();
        col = getBarkColour(key * i + 1.);
        col.setAlpha(branchAlpha);
        stroke(col)
        baseOffset = (c1.x - treeBase.x) / 20.;
        baseOffset = noise(value * key) * baseOffset;

        bezier(endX + windXLeft, endY + windY, c1.x, c1.y, c2.x, c2.y, treeBase.x - baseOffset, treeBase.y);
        bezier(width - endX + windXRight, endY + windY, width - c1.x, c1.y, width - c2.x, c2.y, width - treeBase.x + baseOffset, treeBase.y);
        //draw leaves
        numLeaves = map(value, minFreq, maxFreq, minLeaves, maxLeaves);
        for (var i = 0; i < numLeaves; i++) {
            cw = noise(value * (i + 1.)) * leafMaxWidth * 1. + order / 6.;
            ch = noise(value * (i + 1. * value)) * leafMaxHeight * 1. + order / 6.;

            rx = noise(key * i) * leafRange;
            rx += noise(key * i * rx*value) * leafRange/6.;;
            rx = rx - leafRange / 2.
            ry = noise(key * i * rx) * leafRange;
            ry += noise(key * i * ry*value) * leafRange/6.;;
            ry = ry - leafRange / 2

            c1rx = noise(key * i) * branchXRange;
            c1rx = c1rx - branchXRange / 2.;
            c2rx = noise(key * i * c1rx) * branchXRange;
            c2rx = c2rx - branchXRange / 2.;
            c1ry = noise(key * i) * branchYRange;
            c1ry = c1ry - branchYRange / 2.;
            c2ry = noise(key * i * c1ry) * branchYRange;
            c2ry = c2ry - branchYRange / 2.;



            noFill();
            col = getBarkColour(key * i + 1.);
            col.setAlpha(branchAlpha);
            stroke(col)
            bezier(endX + rx + windXRight, endY + ry + windY, c1.x + c1rx, c1.y + c1ry, c2.x + c2rx, c2.y + c2ry, treeBase.x - baseOffset, treeBase.y);
            bezier(width - endX - rx + windXLeft, endY + ry + windY, width - c1.x - c1rx, c1.y + c1ry, width - c2.x - c2rx, c2.y + c2ry, width - treeBase.x + baseOffset, treeBase.y);


            col = getLeafColour(endY, rx);
            col.setAlpha(leafAlpha);
            fill(col);
            ellipse(endX + rx + windXRight, endY + ry + windY, cw, ch);
            ellipse(width - endX - rx + windXLeft, endY + ry + windY, cw, ch);

        }
        //always have one on the tip
        col = getLeafColour(endY, 1.);
        col.setAlpha(leafAlpha);
        fill(col);
        ellipse(endX + windXRight, endY + windY, cw, ch);
        ellipse(width - endX + windXLeft, endY + windY, cw, ch);
        order++;
    }
}

function getLeafColour(posY, seed) {
    colorMode(HSB, 100);
    rand = noise(seed);
    let h, s, v;
    sunH = 70;
    sunS = 80;
    sunV = 80;
    shadowH = 180;
    shadowS = 27;
    shadowV = 17;

    factor = 1. - posY / height;
    if (rand < .1) {
        h = 210.;
        s = 36;
        v = 35;
    }
    else if (rand < .3) {
        h = 128.;
        s = 28;
        v = 24;
    }
    else {
        h = 92.;
        s = 51;
        v = 51;
    }
    h = lerp(h, sunH, factor);
    h += ((noise(seed) * 3) - 3 / 2.);
    s = lerp(s, sunS, factor);
    s += ((noise(seed) * 35) - 30.);
    v = lerp(v, sunV, factor - .2);
    v += ((noise(seed) * 6) - 6 / 2.);
    return color(h / 360. * 100, s, v);

}

function getBarkColour(seed) {

    colorMode(HSB, 100);
    rand = noise(seed);
    if (rand < .1) {
        return color(26. / 360. * 100, 15, 19);
    }
    else if (rand < .3) {
        return color(0. / 360. * 100, 0, 0);
    }
    else {
        return color(42. / 360. * 100, 11, 37);
    }

}


async function keyReleased() {
    if (key === 'x') {
        m = month();
        d = day();
        y = year();
        h = hour();
        mi = minute();
        se = second();
        save(y + '.' + m + '.' + d + '_' + h + '.' + mi + '.' + se + '.jpg');
    }
    else if(keyCode === RETURN)
     {
        await clearInterval(pullData);
        termFrequencyData.clear();
        minFreq = 10000000000000;
        maxFreq = 0;
        totalFreq = 0.
        avgFreq = 0
        itr = 0;
        genURLs();
        await loadJSON(url[itr], gotData);
        pullData = setInterval(function () { loadURLs(); }, 7000)


     }
     else if( keyCode === BACKSPACE )
     {
         searchTerm = searchTerm.substring(0, searchTerm.length - 1);
     }
     else{
         searchTerm += key;
     }

    return false; //need to ahve this for some browsers
}

