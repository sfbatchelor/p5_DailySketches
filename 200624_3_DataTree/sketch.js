let  stemBase;

function setup() {
    createCanvas(3000, 1000);
    console.log('hello');
    colorMode(HSB, 100);
    background(90);
    stemBase  = {
                x : random(0, width ),
                y : height,
            };
 
}

function draw() {

    colorMode(HSB, 100);
    if (mouseIsPressed) {
        if (mouseButton === LEFT) {
            num =  random()*3;
            //background('rgba(100%,100%,100%,0.006)');
            for (let i = 0; i < num; i++) {
            r = 10+pow(random(),15) * 50;
            rh = 10+pow(random(),1) * 100;
            rx = random(-1, 1) * 220;
            ry = random(-1, 1) * 220;
            c1 = {
                x: random(stemBase.x - rx, stemBase.x + rx),
                y: random(stemBase.y, mouseY + ry)
            },
                c2 = {
                    x: random(stemBase.x - 10, stemBase.x + 10),
                    y: random(stemBase.y, stemBase.y - 80)
                }
                fill(getLeafColour(mouseY + ry));
                ellipse(mouseX + rx, mouseY + ry, r, rh);
                noFill();
                bezier(stemBase.x, stemBase.y, c1.x, c1.y, c2.x, c2.y, mouseX + rx, mouseY + ry);
                stroke(getBarkColour());

            }
        }
    }
}

function touchStarted() {
    stemBase.x = mouseX + random(-1, 1) * 20;
    //stemBase.y = mouseY + 100 + random() * 200;

}

function getLeafColour(posY)
{
    colorMode(HSB, 100);
    rand = random();
    let h,s,v;
    sunH = 70;
    sunS = 80;
    sunV = 80;
    shadowH = 180;
    shadowS = 27;
    shadowV = 17;
   
    factor = 1. - posY/height;
    if(rand < .1)
    {
        h = 210.;
        s = 36;
        v = 35;
    }
    else if(rand < .3)
    {
        h = 128.;
        s = 28;
        v = 24;
    }
    else 
    {
        h = 92.;
        s = 51;
        v = 51;
    }
    h = lerp(h,sunH, factor);
    h += random(-3,3);
    s = lerp(s,sunS, factor);
    s += random(-30,5);
    v = lerp(v,sunV, factor-.2);
    v += random(-6,6);
    return color(h / 360. * 100, s, v);

}

function getBarkColour()
{

    colorMode(HSB, 100);
    rand = random();
    if(rand < .1)
    {
        return color(26./360.*100,15,19);
    }
    else if(rand < .3)
    {
        return color(0./360.*100,0,0);
    }
    else 
    {
        return color(42./360.*100,11,37);
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