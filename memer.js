var c = document.getElementById("slate");
var ctx = c.getContext("2d");
var uploaded = false;
var img;
var DEFAULT_FONT_SIZE = 60;
var DEFAULT_LINE_HEIGHT = DEFAULT_FONT_SIZE + 10;
var SMALL_FONT_SIZE = 40;
var SMALL_LINE_HEIGHT = 46;
var fontSize = DEFAULT_FONT_SIZE;
var lineHeight = DEFAULT_LINE_HEIGHT;    
var NORMAL_SIZE = 500;
var SMALL_SIZE = 350;
var size = NORMAL_SIZE;

var getText = function(e) {
    updateText( this.value );
};

var updateText = function(s) {

    if ( uploaded ) {
	s = s.toUpperCase();
	resetImage( size );
	addText(s);
    }    
};

var resetImage = function() {
    clear();
    uploaded = true;
    //drawImage(img.src, size);
    ctx.drawImage( img, 0, 0, img.width, img.height );
};

var getImage = function(e) {

    //is there a file and is it an image?
    if (this.files &&
	this.files[0] &&
	this.files[0].type.match('image.*')) {
	var r = new FileReader();
	r.onload = updateCanvas;
	r.readAsDataURL( this.files[0] );
    }
};

var updateCanvas = function(e) {
    drawImage(this.result);
};

var resizeImage = function() {

    var w = img.width;
    var h = img.height;
    var r = w / h;
    
    if (w > h ) {
	w = size;
	h = w / r;
    }
    else {
	h = size;
	w = r * h;
    }
    c.width = w;
    c.height = h;
    img.width = w;
    img.height = h;
};

var drawImage = function( pic ) {

    clear();
    img = new Image();
    img.onload = function() {
     	resizeImage();
     	ctx.drawImage( img, 0, 0, img.width, img.height);
    };    
    img.src = pic;
    uploaded = true;
};

var addText = function( text ) {
    if ( size == SMALL_SIZE ) {
	fontSize = SMALL_FONT_SIZE;
	lineHeight = SMALL_LINE_HEIGHT;
    }
    else {
	fontSize = DEFAULT_FONT_SIZE;
	lineHeight = DEFAULT_LINE_HEIGHT;
    }
    ctx.font = fontSize +"px Anton";
    ctx.fontFamily = 'sans-serif';
    var lines = breakText(text);
    var y = c.height - (lineHeight * (lines.length-1)) - 5;
    
    for (var i=0; i < lines.length; i++) {

	var word = lines[i];
	var w = ctx.measureText(word).width;
	var x = c.width/2.0 -  w/2.0;

	//setup outline
	ctx.shadowColor = "black";
	ctx.shadowBlur = 5;
	ctx.lineJoin = 'bevel';
	ctx.lineWidth = 5;
	ctx.strokeText(word, x, y);
	
	//setup text
	ctx.shadowBlur = 0;
	ctx.fillStyle = "white";
	ctx.fillText(word, x, y);

	
	y+= lineHeight;
    }
};

var breakText = function(text) {

    var ls = text.split('\n');
    var lines = [];
    for(var i=0; i<ls.length; i++) {
	lines = lines.concat( resizeLines(ls[i]) );
    }
    return lines;
};

var resizeLines = function( text ) {

    var w = ctx.measureText(text).width;
    var x = c.width/2.0 -  w/2.0;
    
    if (w >= c.width || text.includes('\n') ) {
	var words = text.split(' ');
	var ls = [];
	var subText = '';
	
	while ( words.length != 0 ) {
	    var word = words[0];
	    
	    word = ' ' + word;
	    setFontSize( word);	    
	    w = ctx.measureText(subText+word).width;
	    
	    if ( w < c.width ) {
		subText+= word;
		words.shift();
	    }
	    if ( w >= c.width ||
	       words.length == 0) {
		w = ctx.measureText(subText).width;
		//x = c.width/2.0 -  w/2.0;
		ls.push( subText );
		subText = '';
	    }
	}	
	return ls;
    }
    else
	return [ text ];
};

var setFontSize = function(word) {
    while (ctx.measureText(word).width > c.width) {
	fontSize-= 5;
	lineHeight-= 6;
	ctx.font = fontSize +"px Anton";
    }
};

var clear = function(e) {
    ctx.clearRect(0, 0, c.width, c.height);
    uploaded = false;
};

var saveImage = function(e) {
    this.href = c.toDataURL('image/png');//.replace("image/png", "image/octet-stream");
};


var sizeToggle = function(e) {
    if ( this.innerText == 'Small Meme') {
 	this.innerText = 'Large Meme';
	size = SMALL_SIZE;
	fontSize = SMALL_FONT_SIZE;
	lineHeight = SMALL_LINE_HEIGHT;
    }
    else {
	this.innerText = 'Small Meme';
	size = NORMAL_SIZE;
	fontSize = SMALL_FONT_SIZE;
	lineHeight = SMALL_LINE_HEIGHT;
    }
    resizeImage();
    ctx.drawImage( img, 0, 0, img.width, img.height);
    updateText(document.getElementById('text').value);
};

var button = document.getElementById( "download" );
var button2 = document.getElementById( "size" );
var upload = document.getElementById("file");
var tbox = document.getElementById("text");


tbox.addEventListener("input", getText);
upload.addEventListener("change", getImage);
button.addEventListener( "click", saveImage );
button2.addEventListener("click", sizeToggle);
//for testing purposes
//drawImage('file:///Users/dw/mycloud/programming/memer/luke.jpg');
