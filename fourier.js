//I need to define set principles for mapping a song
//By notes or by chords? I could do the notes of a head or chords of the head
//I need to set a radius and speed per chord, so for example a G chord is 100 radius and speed 0.05. Or G radius is a multiple of 100, not specifically 100.

var circles = 
[
  {
  //Circle 1
  radius: 150,
  angle: -1.57, //since we're working in radians, in order to initialize the circles at the top I moved the angles back by 0.5*pi because they started on the right side and I wanted to move them counterclockwise by 90 degrees
  speed: 0.01,
  centerX: 300, //center of circle
  centerY: 300,
  outerX: 0, //outer points of circle
  outerY: 0,
  },
  {
  //Circle 2
  radius: 90,
  angle: -1.57, //since we're working in radians, in order to initialize the circles at the top I moved the angles back by 0.5*pi because they started on the right side and I wanted to move them counterclockwise by 90 degrees
  speed: 0.01,
  centerX: 0,
  centerY: 0,
  outerX: 0,
  outerY: 0,
  },
  {
  //Circle 3
  radius: 55,
  angle: -1.57, //since we're working in radians, in order to initialize the circles at the top I moved the angles back by 0.5*pi because they started on the right side and I wanted to move them counterclockwise by 90 degrees
  speed: 0.03,
  centerX: 0,
  centerY: 0,
  outerX: 0,
  outerY: 0,
  },
  {
  //Circle 4
  radius: 25,
  angle: -1.57, //since we're working in radians, in order to initialize the circles at the top I moved the angles back by 0.5*pi because they started on the right side and I wanted to move them counterclockwise by 90 degrees
  speed: 0.05,
  centerX: 0,
  centerY: 0,
  outerX: 0,
  outerY: 0,
  },
]

//radius of the small points like the points in center of circle and points in traced trail
var pointradius = 7;

//this is to alternate the trace when the mouse is clicked
trace = true;
d = 1;
function mousePressed()
{
  d += 1;
  if (d % 2 == 0)
  {
    trace = false;
  }
  else
  {
    trace = true;
  }
}

//creating canvas, setting up arrays to track history of outer particle
function setup() { 
  createCanvas(600, 600);
  outerhistoryX = [];
  outerhistoryY = [];
}

function draw() { 
  background(220);
  
  for (var i = 0; i < circles.length; i++)
  { 
    //for some reason this is necessary for scale
    circles[i]["radius"] *= 2;
    
    if (trace == true)
    {
      //draw circles
      ellipse(circles[i]["centerX"], circles[i]["centerY"], circles[i]["radius"]);
      //draw center points
      fill("blue");
      ellipse(circles[i]["centerX"], circles[i]["centerY"], pointradius);
      noFill();

      //draw radii of circles
      line(circles[i]["centerX"], circles[i]["centerY"], circles[i]["outerX"], circles[i]["outerY"]);
    }

    //for some reason this is necessary for scale
    circles[i]["radius"] /= 2;

    //outer points of large circle
    circles[i]["outerX"] = circles[i]["centerX"] + circles[i]["radius"] * cos(circles[i]["angle"]);
    circles[i]["outerY"] = circles[i]["centerY"] + circles[i]["radius"] * sin(circles[i]["angle"]);
  
    
      //rate of change of angle
    circles[i]["angle"] += circles[i]["speed"];
  }

  for (var j = 1; j < circles.length; j++)
  {
    //match the center of the next circle to the outer edge of the previous circle
    circles[j]["centerX"] = circles[j-1]["outerX"];
    circles[j]["centerY"] = circles[j-1]["outerY"];

    //change the angle of the next circle by speed
    circles[j]["angle"] += circles[j]["speed"];
  }

  //draws red point on outermost circle
  fill("red");
  ellipse(circles[circles.length-1]["outerX"], circles[circles.length-1]["outerY"], pointradius);
  noFill();

  //tracing outer point and coloring the trail
  outerhistoryX.push(circles[circles.length-1]["outerX"]);
  outerhistoryY.push(circles[circles.length-1]["outerY"]);

  colors = ["red", "orange", "yellow", "coral", "crimson"];
  var x = 0;

  for (var k = outerhistoryX.length-51; k < outerhistoryX.length-1; k++) //set k=0 to fully trace the entire path
  {
    //coloring the trail by going through colors array
    if (x >= colors.length)
    {
      x = 0;
    }
    fill(colors[x]);
    x += 1;

    coeff = 1;
    //coeff = (Math.random() * 1.5 + 0); //random from 0 to 1.5, surround with Math.floor() to make them integers, this is for a crazy string

    //drawing the path
    ellipse(outerhistoryX[k],outerhistoryY[k], pointradius * coeff); //can draw a path of ellipses
    //line(outerhistoryX[k],outerhistoryY[k], outerhistoryX[k+1],outerhistoryY[k+1]); //draws a microline between two past points to make a smooth curve
    noFill();
  }

}
