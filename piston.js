//circle's properties
var centerX = 300;
var centerY = 400;
var outerX = 0;
var outerY = 0;
var angle = 0;
var radius = 60;
var speed = 5; //it's much easier if this is a whole number!

//upper red point's properties
var pointX = centerX;
var pointY = 150; //can set the height of the point

var pointradius = 7;

//buttons and sliders
let decbutton;
let incbutton;
let speedslider;
let transmissionslider;

function setup() { 
  createCanvas(600, 600);

  //buttons to let user adjust speed of piston
  decbutton = createButton("Decrease Speed");
  decbutton.position(50,50);
  decbutton.size(120,25);
  decbutton.mousePressed(decSpeed);
  incbutton = createButton("Increase Speed");
  incbutton.position(50,80);
  incbutton.size(120,25);
  incbutton.mousePressed(incSpeed);

  //slider to let user adjust speed more quickly (top left)
  speedslider = createSlider(-170, 170, 5, 1); //-170 to 170 speed, initial speed is 5
  speedslider.position(70,110);
  speedslider.style('width', '100px')

  //slider to shift gears (bottom left)
  transmissionslider = createSlider(0, 4, 0, 1);
  transmissionslider.position(50, 370);

}

function decSpeed() //this is the function that is activated when the decrease speed button is pressed
{
  speed -= 1;
  speedslider.value(speed); //when button changes speed it updates slider value to match, this is the only way the slider can work with the button in this case
}

function incSpeed() //this is the function that is activated when the increase speed button is pressed
{
  speed += 1;
  speedslider.value(speed); //when button changes speed it updates slider value to match
}

function draw() { 
  background(220);

  //the value of the slider is what speed will be, so if I slide the slider to 100, then this will set speed also to 100.
  let speedval = speedslider.value();
  speed = speedval;

  //speed and RPM counter display (top left and right display bar stats)
  fill("black");
  textSize(16);
  textStyle(BOLD);
  text("Speed:", 180, 75);
  textStyle(NORMAL);
  text(speed, 240, 75);
  textStyle(BOLD);
  text("Real RPM:", 430, 65);
  textStyle(NORMAL);
  var rpm = speed * 10;
  text(rpm, 460, 90);
  //on speed 1, 1 rotation took 6 seconds. on speed 2, 1 rotation took 3 seconds. even the radius size doesn't matter. This means speed 1 is 10 rpm, speed 2 is 20 rpm.

  //this changes the big letter in the top right corner (D for Drive, N for Neutral, R for Reverse)
  if (speed > 0)
  {
    fill("green");
    textSize(32);
    textStyle(BOLD);
    text("D", 370, 80); //put the engine in drive
    textStyle(NORMAL);
  }
  if (speed == 0)
  {
      //speed counter display
    fill("yellow");
    textSize(32);
    textStyle(BOLD);
    text("N", 370, 80); //put the engine in neutral
    textStyle(NORMAL);
  }
  if (speed < 0)
  {
      //speed counter display
    fill("red");
    textSize(32);
    textStyle(BOLD);
    text("R", 370, 80); //put the engine in reverse
    textStyle(NORMAL);
  }

  //draw foci (pointX)
  fill("black");
  ellipse(pointX, pointY, pointradius);
  noFill();

  //draw large center circle
  ellipse(centerX, centerY, radius*2);
  //draw point in center
  fill("black");
  ellipse(centerX, centerY, pointradius);
  noFill();
  
  //outer points of large circle
  outerX = centerX + radius * cos(angle);
	outerY = centerY + radius * sin(angle);

  //draw line from center of large circle to outer point on large circle (the radius)
  line(centerX, centerY, outerX, outerY);

  //outer red point on large circle
  fill("black");
  ellipse(outerX,outerY, pointradius);
  noFill();

  //line from outer circle point to pointX
  strokeWeight(2);
  line(outerX,outerY, pointX, pointY);
  strokeWeight(1);
  var distance = dist(outerX,outerY, pointX, pointY);

  //set to degrees rather than radians
  angleMode(DEGREES);

  //piston driveshaft (the line from pointX to finalpointX)
  totaldist = dist(pointX, pointY, outerX, outerY);
  total = radius + centerY - pointY + 10; //about 392? The 10 is a little overlap because without it then it would land right on the pointY
  finalpointX = centerX;
  finalpointY = pointY - (total-totaldist);
  strokeWeight(2);
  line(pointX, pointY, finalpointX, finalpointY);
  strokeWeight(1);

  //drawing rectangle (piston head)
  fill(150);
  pistonwidth = 47;
  pistonheight = 15;
  rect(finalpointX - pistonwidth/2, finalpointY - pistonheight, pistonwidth, pistonheight);
  noFill();

  //drawing piston shaft (the box that contains the piston)
  line(finalpointX + pistonwidth/2, 5, finalpointX + pistonwidth/2, pointY - 10); //right side line
  line(finalpointX - pistonwidth/2, 5, finalpointX - pistonwidth/2, pointY - 10); //left side line

  //drawing lines from piston shaft to edges of screen for styling
  line(finalpointX - pistonwidth/2, pointY - 10, 0, pointY - 10);
  line(finalpointX + pistonwidth/2, pointY - 10, width, pointY - 10);
  //line(finalpointX - pistonwidth/2, pointY + 30, 0, pointY + 30);
  //line(finalpointX + pistonwidth/2, pointY + 30, width, pointY + 30);
  //line(finalpointX + pistonwidth/2, pointY + 30, finalpointX + pistonwidth/2, pointY - 10);
  //line(finalpointX - pistonwidth/2, pointY + 30, finalpointX - pistonwidth/2, pointY - 10);
  

  //gas color animations
  if (outerX > centerX)
  {
    fill("orange");
    rect(finalpointX - pistonwidth/2, 5, pistonwidth, finalpointY - pistonheight);
    noFill();
  }
  if (outerX < centerX)
  {
    fill("lightblue");
    rect(finalpointX - pistonwidth/2, 5, pistonwidth, finalpointY - pistonheight);
    noFill();
  }

  //rate of change of angle (of the circle). This causes the entire thing to move at a certain speed
  angle += speed;

  //this is configuring the transmission slider on the left of the rotating circle
  transmissionratios = [3.66, 2.05, 1.26, 0.86, 0.67];
  let transmissionval = transmissionslider.value();
  currentgear = transmissionratios[transmissionval];
  fill("black");
  textSize(20);
  //the following if loops make sure that only gears 1 to 5 are displayed when car is in drive and that otherwise only N or R are displayed like a real car. Also since a real car only has one reverse gear, the transmission ratio stays at 3.66 in reverse and neutral.
  if (speed > 0)
  {
    text("Gear: " + (transmissionval + 1), 70, 350);
  }
  if (speed == 0)
  {
    text("Gear: N", 70, 350);
    currentgear = 1; //i think it should actually be 0, but then mph returns NaN
  }
  if (speed < 0)
  {
    text("Gear: R", 70, 350);
    currentgear = transmissionratios[0];
  }


  //our real speed based on RPMs (this whole chunk is the paragraph on the left of the diagram)
  tires = 27;
  axlegearratio = 4.1;
  transmissiongearratio = currentgear;
  textSize(10);
  text("If we assume our tires are " + tires + " inches in diameter", 25, 200);
  text("and our axle gear ratio is " + axlegearratio, 25, 220);
  text("and our transmission gear ratio is " + transmissiongearratio + ":", 25, 240);
  var circumference = 2 * 3.14 * tires; //circ of tires
  circumference *= rpm; //how many inches we'll travel in one minute
  circumference /= 12; //how many feet per minute
  circumference *= 60; //how many feet per hour
  circumference /= 5280; //mph

  text("...we might be able to go", 25, 270);
  text(Math.floor(circumference / (axlegearratio * transmissiongearratio) * 100) / 100 + " mph", 35, 290);

  //this is a super cool example of why transmission ratios are essential: set the transmission ratio to 3.66, which is first gear, and set rpms to max. It only goes to like 18 mph. If you set it to 0.67, which is fifth gear, it can go up to 99 mph at only 1700 rpm.

}
