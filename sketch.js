//initialises artwork
let treasureArtwork;
let backgroundArtwork;
let foregroundArtwork;

//initialises sounds
let boingSound;
let collectSound;
let lossSound;

//x y pos for background
let backgroundY1 = 0;
let backgroundY2 = -800; 
let foregroundY1 = 0;
let foregroundY2 = -800;

// Speeds for parallax effect
let backgroundSpeed = 1; // Background moves slower
let foregroundSpeed = 2; // Foreground moves faster

//x y pos
let xRectPos, yRectPos;
let xBallPos, yBallPos;
let xTre1Pos, yTre1Pos;
let xTre2Pos, yTre2Pos;

// keep track of ball color
let r = 255;
let g = 255;
let b = 255;

// keep track of box speed
let xBallSpeed;
let yBallSpeed;

//keep track of treasure speed 
let tresSpeed = 4; 

//keep track of score
let score = 0;

//load in graphical and sound assets
function preload() {
    treasureArtwork = loadImage("../assignment02/images/treasure.png");
    backgroundArtwork = loadImage("../assignment02/images/background.png");
    foregroundArtwork = loadImage("../assignment02/images/foreground.png");

    //sounds
    boingSound = loadSound("../assignment02/sounds/boing.mp3");
    collectSound = loadSound("../assignment02/sounds/collect.mp3");
    lossSound = loadSound("../assignment02/sounds/loss.mp3");

}

function setup(){
    let canvas = createCanvas(600,800);
    canvas.id("canvas_element");

    //initialises paddle position bottom center
    xRectPos = 200;

    //initialises  ball postion in the middle of the top
    xBallPos = 300;
    yBallPos = 40;

    //initialises treasure position off-screen
    xTre1Pos = -50;
    yTre1Pos = random(100,height - 100);

    xTre2Pos = width + 50;
    yTre2Pos = random(100,height - 100);

    //initializes speed of ball
    xBallSpeed = 0;
    yBallSpeed = 0;

    // pick some background colors
    r = random(255);
    g = random(255);
    b = random(255);

    // pick some background change speeds
    rs = random(-2,2);
    gs = random(-2,2);
    bs = random(-2,2);

}

function draw(){

    //draw background images
    image(backgroundArtwork,0,backgroundY1,600,1000);
    image(backgroundArtwork,0,backgroundY2,600,1000);

    //move backrgound down
    backgroundY1 += backgroundSpeed;
    backgroundY2 += backgroundSpeed;

    //Reset background position when it goes off screen to create a seamless loop
    if (backgroundY1 >= height) {
        backgroundY1 = backgroundY2 - 1000;
    }
    if (backgroundY2 >= height) {
        backgroundY2 = backgroundY1 - 1000;
    }

    //draw foreground images 
    image(foregroundArtwork,0,foregroundY1,600,1000);
    image(foregroundArtwork,0,foregroundY2,600,1000);

    //move foreground down
    foregroundY1 += foregroundSpeed;
    foregroundY2 += foregroundSpeed;
    
    // Reset foreground position when it goes off screen to create a seamless loop
    if (foregroundY1 >= height) {
        foregroundY1 = foregroundY2 - 1000;
    }
    if (foregroundY2 >= height) {
        foregroundY2 = foregroundY1 - 1000;
    }


    //scorboard
    noStroke();
    textSize(25);
    fill(255,255,255);
    text("Points: " + score, 30, 50);

    //draw paddle
    fill(150,150,150);
    noStroke();
    rect(xRectPos,780,200,20);


    //move paddle left or right based on key press
    if (keyIsDown(65)) { 
        xRectPos -= 5;
    }
    if (keyIsDown(68)) { 
        xRectPos += 5;
    }

    //stop paddle at the left or right edge
    if (xRectPos < 0) {
        xRectPos = 0;
    }
    if (xRectPos > width - 200) {
        xRectPos = width - 200;
    }

    //draw ball
    fill(r,g,b);
    ellipse(xBallPos, yBallPos,50,50);
    

    //ball colors
    r += rs;
    g += gs;
    b += bs;

    // Bounce color speed change?
    if (r > 255 || r < 0) {
        rs *= -1;
    }
    if (g > 255 || g < 0) { // This should check g
        gs *= -1;
    }
    if (b > 255 || b < 0) {
        bs *= -1;
    }

    //update ball position
    xBallPos += xBallSpeed;
    yBallPos += yBallSpeed;

    //limit max ball speed
    let maxSpeed = 15;


    // Did the ball hit the left or right edge?
    if (xBallPos > width - 25 || xBallPos < 25) {
        xBallSpeed *= -1;
        if (abs(xBallSpeed) < maxSpeed) {
            xBallSpeed *= 1.05;
        }
        boingSound.play();
    }

    // Did the ball hit the top or bottom edge?
    if (yBallPos > height - 25 || yBallPos < 25) {
        yBallSpeed *= -1;
        if (abs(yBallSpeed) < maxSpeed) {
            yBallSpeed *= 1.05;
        }
        boingSound.play();
    }

    // ball collision detection with paddle
    if (yBallPos > 755 && yBallPos < 780) { // Check if ball is near the paddle's top
        if (xBallPos > xRectPos && xBallPos < xRectPos + 200) { // Ball within the paddle's width

            // Calculate how far the ball hit from the center of the paddle
            let paddleCenter = xRectPos + 100; // Center of the paddle (paddle width is 200)
            let distanceFromCenter = xBallPos - paddleCenter; // How far from the center the ball hit

            // Edge hits increase speed, center hits reduce speed
            xBallSpeed = map(distanceFromCenter, -100, 100, -8, 8); // Remap -100 to 100 to -8 to 8 for X speed adjustment

            yBallSpeed *= -1; // Bounce the ball in the Y direction
            yBallSpeed *= 1.05; // Slight speed increase (5%) in Y direction

            // Ensure X speed is not too small (to avoid getting stuck moving straight up)
            if (abs(xBallSpeed) < 3) {
                xBallSpeed = xBallSpeed < 0 ? -3 : 3; // Set minimum speed in X direction
            }
        }
    }
    

    //ball misses
    if (yBallPos > height - 25) {
        //Loss sound
        lossSound.play();
    
        //reset ball to default position
        xBallPos = 300;
        yBallPos = 40;
    
        //reset ball speed to 0 so the game can restart on mouse press
        xBallSpeed = 0;
        yBallSpeed = 0;
    
        //reset score
        score = 0;
    }

    //draw treasures
    image(treasureArtwork, xTre1Pos, yTre1Pos, 60, 60);
    image(treasureArtwork, xTre2Pos, yTre2Pos, 60, 60);


    //move treasures
    //treasure 1
    xTre1Pos += tresSpeed;
    yTre1Pos += tresSpeed *0.25;

    //treasure 2
    xTre2Pos -= tresSpeed;
    yTre2Pos += tresSpeed *0.25;


    //reset treasures to random offscreen position
    if (xTre1Pos > width) {
        xTre1Pos = -50;
        yTre1Pos = random(100, height - 100);
    }
    if (xTre2Pos < -50) {
        xTre2Pos = width + 50;
        yTre2Pos = random(100, height - 100);
    }
    

    //ball collision with treasure 1
    if (dist(xBallPos, yBallPos, xTre1Pos + 30, yTre1Pos + 30) < 50) {
        // 30 is half of 60, which is the treasure's size
        xTre1Pos = -50;
        yTre1Pos = random(100, height - 100);
        collectSound.play();
        score += 1;
    }

    //ball collision with treasure 2
    if (dist(xBallPos, yBallPos, xTre2Pos + 30, yTre2Pos + 30) < 50) {
        xTre2Pos = width + 50;
        yTre2Pos = random(100, height - 100);
        collectSound.play();
        score += 1;
    }
    // borders
    stroke(100);
    strokeWeight(20);
    line(0, 0, 0, height); // left
    line(width, 0, width, height); // right
    line(0, 0, width, 0); // top    
    
}

function mousePressed(){
    if (xBallSpeed === 0 && yBallSpeed === 0) {
        xBallSpeed = random(1,7);
        yBallSpeed = random(1,7);
    }
}

