//Global variables
var canvas, ctx;
var lensDirt, lensDirtCtx;

var prevTime = 0;
var currentTime = 0;

var dots = [];
var stars = [];

var width, height;




//-----------------------------------------------------------
//   INIT FUNCTION
//-----------------------------------------------------------

function init() {

	// SET UP //
	canvas = document.getElementById("myCanvas");
	lensDirt = document.getElementById("lensDirt");

	// Specify 2d canvas type.
	ctx = canvas.getContext("2d");
	lensDirtCtx = lensDirt.getContext("2d");

	width = 500;
	height = 500;
	canvas.width = width;
	canvas.height = height;

	lensDirt.width = width;
	lensDirt.height = height;

	// Metrics
	var cx = 250;
	var cy = 250;


	createNoise(true);
	createStars();

	loop();

	createLensDirt();
}

//-----------------------------------------------------------
//   MAIN DRAW FUNCTION
//-----------------------------------------------------------

function draw() {

	// background 
	drawBackground();

	// stars
	for (i=0;i<stars.length;i++) {
		var star = stars[i];
		star.draw();
		star.x = star.x + star.xVelocity;
		star.y = star.y + star.yVelocity;

		if (star.x > width || star.y < height * 0.4) {
			star.x = tombola.range(-150,width);
			star.y = height;
		};
	}

	// saturn
	drawSaturn();

	//overlay lens dirt
	//var lensDirtData = lensDirt.getImageData();

	ctx.drawImage(lensDirt,0,0);


}


//-----------------------------------------------------------
//   DRAWING FUNCTIONS
//-----------------------------------------------------------


// BACKGROUND //

function drawBackground() {
	ctx.fillStyle = "RGBA(153,153,153,1)";
	ctx.fillRect(0, 0, width, height);
}

// SATURN //
var saturnX = -400;
var saturnY = -2400;
var saturnRadius = 2750;




function drawSaturn() {
	var saturnGrad = ctx.createRadialGradient(saturnX, saturnY, saturnRadius, saturnX, saturnY, saturnRadius - 7);
	saturnGrad.addColorStop(0, "RGBA(68,68,68,0)");
	saturnGrad.addColorStop(1, "RGBA(68,68,68,1)");

	ctx.fillStyle = saturnGrad;
	ctx.beginPath();
	ctx.arc(saturnX, saturnY, saturnRadius, 0, (Math.PI * 2));
	ctx.fill();
}


// NOISE //

// Create dot
function Dot(x, y) {
	this.x = x;
	this.y = y;
}

Dot.prototype.draw = function() {

	ctx.fillStyle = "RGBA(255,255,255,0.2)";
	ctx.beginPath();
	ctx.arc(this.x, this.y, 1.2, 0, (Math.PI * 2));
	ctx.fill();				
}

// Draw noise
function createNoise(update) {
	for (var i = 0; i < 250; i++) {			
		if (update) {
			var dot = new Dot(Math.random() * width,Math.random() * height);
			dots[i] = dot;
		}

		dots[i].draw();
	}
}	





//for (var i = 0; i < 30; i++) createNoise();

//-----------------------------------------------------------
//   STARS
//-----------------------------------------------------------

// "SHOOTING STARS" //

// Create star
function Star(x,y,angle,speed,opacity) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.opacity = opacity;

	var radians = angle * Math.PI / 180;
	this.xVelocity = Math.cos(radians) * speed;
	this.yVelocity = -Math.sin(radians) * speed;
}

Star.prototype.draw = function() {
	ctx.strokeStyle = "RGBA(255,255,255," + this.opacity + ")";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x - 6, this.y + 7);
	ctx.stroke();
}


function createStars() {
	for (i=0;i<30;i++) {
		var speed = 0;

		if (tombola.percent(25)) {
			speed = tombola.rangeFloat(0.5,3.5); 
		} else {speed = tombola.rangeFloat(3.5, 6);}

		var opacity = 0;
		if (tombola.percent(20)) {opacity = tombola.rangeFloat(0.7,1)}
		else {opacity = tombola.rangeFloat(0.1,0.7)};

		var star = new Star(tombola.range(-150,width), height, 45, speed, opacity);
		stars.push(star);
	}
}





//-----------------------------------------------------------
// ANIMATION LOOP
//-----------------------------------------------------------

var loop = function(time) {

	draw();

	//var update = false;

	//if (time - prevTime > 100) {
		//update = true;
		//prevTime = time;
	//}

	//createNoise(update);

	window.requestAnimationFrame(loop);


};


//-----------------------------------------------------------
//   LENS DIRT
//-----------------------------------------------------------

// Gets drawn once to the lensDirt canvas which then gets drawn to the main canvas
function createLensDirt() {
	var c = lensDirtCtx;

	// lens dirt
	for (var i = 0;i<1000;i++) {	
		var alpha = tombola.rangeFloat(0.02,0.05);
		if (tombola.percent(5)) alpha = tombola.rangeFloat(0.06,0.4);
		var x = tombola.range(0, width);
		var y = tombola.range(0, height);
		var radius = tombola.rangeFloat(0.5,1.5);
		if (tombola.percent(10)) radius = tombola.rangeFloat(1.6,2.5);

		c.fillStyle = "RGBA(255,255,255," + alpha + ")";
		c.beginPath();
		c.arc(x, y, radius, 0, (Math.PI * 2));
		c.fill();
	}

	//noise

	var noiseResolution = 2;

	//columns
	for (var i=0; i<width; i+=noiseResolution) {
		//rows
		for (var j=0; j<height; j+=noiseResolution) {
			var alpha = tombola.rangeFloat(0,0.05);

			c.fillStyle = "RGBA(255,255,255," + alpha + ")";
			c.fillRect(i, j, noiseResolution, noiseResolution);
		}
	}
}

