var images;
var mouse = new Point(0,0);
var ctx;
var G_vmlCanvasManager;
var count;

function init() {
	//find all images;
	images = $("#hexgrid img");

	count = images.length;

	column = 0;
	row = 0;
	for (var i=0; i < count; i++) {
		images[i].style.display = "none";
		images[i].href = images[i].parentNode.href;
		if(row %2 ==0){
			images[i].xpos = column*170+75;
		} else {
			images[i].xpos = column*170+160;
		}
		images[i].ypos = row*49+75;
		column ++;
		if((row %2 == 0 && column == 5) || (row %2 != 0 && column == 4)){
			column = 0;
			row ++;
		}
	}
  var el = document.getElementById('hexgrid_canvas');
//<!--[if IE]>G_vmlCanvasManager.initElement(el);<![endif]-->
  ctx = el.getContext('2d');

$("#hexgrid_canvas").mousemove(function(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
	draw();	
});

$("#hexgrid_canvas").mouseup(function(e) {
	images.sort(sortByDistance);
	switch(e.which){
		case 1:
			window.location = images[images.length-1].href;
			break;
		case 2:
			window.open(images[images.length-1].href);
			break;
	}
});

  draw();
}  



function Point(x,y)
{
	this.x=x;
	this.y=y;
}

function getScale(distance,size) {
	return size/distance;
}

function distance(x, y) {
	var point = new Point(x-mouse.x, y-mouse.y);
	return Math.sqrt((point.x*point.x)+(point.y*point.y));
}

function drawIcon(ctx, xpos, ypos, xdim, ydim, image, glow) {
	falloff =100;
	
	scale = getScale(distance(xpos,ypos), falloff);
	if(scale < .75) scale = .75;
	if(scale > 1) scale = 1;
	ctx.save();
	
	if(glow) {
		ctx.shadowBlur    = 15;
		ctx.shadowColor   = 'rgba(0, 255, 255, 1)';
	}

	polygon(ctx, 6, (xdim/2)*scale, 0, xpos,ypos, true);		
	ctx.clip();
	ctx.drawImage(image, xpos-(xdim/2*scale), ypos-(ydim/2*scale), xdim*scale, ydim*scale);	
	ctx.restore();
	ctx.restore();
}

function polygon(ctx, points, radius, rotation, xpos, ypos, fill) {
	
	ctx.moveTo(Math.cos(rotation*Math.PI/180)*radius+xpos,Math.sin(rotation*Math.PI/180)*radius+ypos);
	ctx.beginPath();
	for (i = rotation; i <= 360 + rotation; i=i + 360/points) {
		ctx.lineTo(Math.cos(i*Math.PI/180)*radius+xpos,Math.sin(i*Math.PI/180)*radius+ypos);
	}
	ctx.closePath();
	
	if(fill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}

function sortByDistance(a,b) {
	var x = a.distance;
	var y = b.distance;

	return((x>y)?-1:((x<y)?1:0));
}

function draw() {
  ctx.clearRect(0,0,900,600); // clear canvas  
 
  ctx.scale(1,1);

  ctx.save();

count = images.length;

	for(var i=0; i<count; i++) {
		images[i].distance = distance(images[i].xpos, images[i].ypos);
	}

	images.sort(sortByDistance);

  	for(var i=0; i<count; i++) {
		if(i == count-1) glow=true; else glow=false;
		drawIcon(ctx, images[i].xpos, images[i].ypos, 150,150, images[i], glow);	
	}

  ctx.restore();
}
