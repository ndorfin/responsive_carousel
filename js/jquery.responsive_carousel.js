/*
Description: A progressively-enhanced and responsive carousel,
             based on Brad Frost's Fluid Carousel:
             http://codepen.io/bradfrost/full/tdacu
Author:      Shaun O'Connell - shaun@tactile.co.za
More info:   http://tactile.co.za (eventually)
Requires:    jQuery 1.8.2+
*/

var log = function(obj){
	if (window.console) {
		window.console.log(obj);
	}/*else{
		alert(obj);
	}*/
};

$.fn.loadimage = function(src, alt, f) {
	return this.each(function() {
		var i = new Image();
		i.src = src;
		alt ? i.alt = alt : i.alt = "";
		i.onload = f;
		this.appendChild(i);
	});
}

function enhance_carousel(){
	// Progressively add images to the carousel
	var img_len = carousel_images.length,
	    ul = $('<ul></ul>');
	for (var i=0; i<img_len; i++) {
		var li = $('<li></li>'),
		    src = carousel_images[i][0];
		li.loadimage(src);
		ul.append(li);
	}
	$('#carousel').append(ul);
	$('#carousel').append('<nav><ul><li class="next"><a href="#next">Next</a></li><li class="previous"><a href="#previous">Previous</a></li></ul></nav>');
}

$(document).ready(function() {
	enhance_carousel();
});

(function(w){
	// Initialise the carousel
	var sw = document.body.clientWidth,
	    current = 0,
	    breakpointSize = window.getComputedStyle(document.body,':after').getPropertyValue('content'),
	    multiplier = 1, /*Determines the number of panels*/
	    $carousel,
	    $cList,
	    //$cContainer,
	    $cWidth,
	    cLeft,
	    $li,
	    $liLength,
	    numPages,
	    $prev,
	    $next;

	$(document).ready(function() {
		$carousel = $('#carousel'),
		$cList = $('#carousel > ul'),
		//$cContainer = $('#carousel_container'),
		$cWidth = $carousel.outerWidth(),
		cLeft = $cList.css("left").replace("px",""),
		$li = $cList.find('li'),
		$liLength = $li.size(),
		numPages = $liLength/multiplier,
		$prev = $('#carousel nav .previous a'),
		$next = $('#carousel nav .next a');
		$prev.on("click", function(e){ //Previous Button Click
			e.preventDefault();
			moveRight();
		});
		$next.on("click", function(e){ //Next Button Click
			e.preventDefault();
			moveLeft();
		});
		buildCarousel();
	});
	
	$(window).resize(function(){ //On Window Resize
		sw = document.body.clientWidth;
		$cWidth = $carousel.width();
		breakpointSize = window.getComputedStyle(document.body,':after').getPropertyValue('content');  /* Conditional CSS http://adactio.com/journal/5429/ */
		sizeCarousel();
		posCarousel();
	});
	
	function sizeCarousel() { //Determine the size and number of panels to reveal
		current = 0;
		animLimit = $liLength/multiplier-1;
		$cList.width($cWidth * $liLength);
		$li.outerWidth(100/$liLength + '%'); //Set panel widths
	}
	
	function buildCarousel() { //Build the Carousel
		sizeCarousel();
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			buildSwipe();
		}
	}
	
	function posCarousel() { //Animate Carousel. CSS transitions used for the actual animation.
		var pos = -current * $cWidth;
		$cList.addClass('animating').css("left",pos);
		setTimeout(function() {
			$cList.removeClass('animating');
			cLeft = $cList.css("left").replace("px","");
		}, 500);  // will work with every browser
	}

	function moveRight() {
		if(current>0) {
			current--;
		}
		posCarousel();
	}

	function moveLeft() {
		if(current<animLimit) {
			current++;
		}
		posCarousel();
	}

	function buildSwipe() {
		var threshold = 80,
		    origX = 0,
		    finalX = 0,
		    changeX = 0,
		    changeY = 0,
		    curPos;
		//Touch Start
		$carousel.get(0).addEventListener("touchstart", function (event) {
			origX = event.targetTouches[0].pageX;
			curPos = origX;
		});
		//Touch Move
		$carousel.get(0).addEventListener("touchmove", function (event) {
			finalX = event.touches[0].pageX,
			diffX = origX - finalX,
			leftPos = cLeft-diffX;
			event.preventDefault();
			$cList.css("left",leftPos);
		});
		//Touch Move
		$carousel.get(0).addEventListener("touchend", function (event) {
			var diffX = origX - finalX,
			    diffXAbs = Math.abs(diffX);
			if (diffX > 0 && diffXAbs > threshold) {
				moveLeft();
			} else if (diffX < 0 && diffXAbs > threshold) {
				moveRight();
			} else {
				posCarousel();
			}
			origX = finalX = diffX = 0;
		});
	}
})(this);