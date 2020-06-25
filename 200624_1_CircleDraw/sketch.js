function setup() {
    createCanvas(600, 600);
    console.log('hello');
    background(100);
}

function draw() {

    if (mouseIsPressed) {
        if(mouseButton === LEFT)
        {
            ellipse(mouseX, mouseY, 80, 80);
        }
        else if (mouseButton === CENTER)
        {
            background(100);
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

    return false; //need to ahve this for some browsers
}