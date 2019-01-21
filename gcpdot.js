
/**
 * Channeled and Sourced by Brad, Anderson©, Sui Generis, World Citizen
 * Creative Commons 2013-<?php echo(date('Y',time()+86400)."\n") // 2016 ?>
 * Data provided by the Global Consciousness Project http://global-mind.org
 *
 * to contact the author email yinyang108@icloud.com
 */

function gcpchart_initialize(id)
{
	var chart = {
		element : null,
		dataSource : 'http://global-mind.org/gcpdot/gcpgraph.php',
		dataLoaderTimeout : null,
		canvas : null,
		lastCanvasWidth : -1,


		graphics : {
			dotSize : 15,
			shadowOffset : 10,
			gscalar: 1,
			bscalar: 1,
			element : null,
			canvas : null,
			context : null,
			canvasShadow : null,
			contextShadow : null,
			lineDiv : null,
			dataDiv : null,
			lastData : null,

			bgImage : null,
			imgBuffer : null,

			initialize : function(element)
			{
				this.element = element;

				this.lineDiv = document.createElement('div');
				this.lineDiv.style.position = 'absolute';
				this.lineDiv.style.top = '20px';
				this.lineDiv.style.left = '0px';
				this.lineDiv.style.width = '1px';
				this.lineDiv.style.zIndex = 1010;
				this.lineDiv.style.borderLeft = '1px solid rgba(255, 255, 255, 1)';
				this.lineDiv.style.display = 'none';
				element.appendChild(this.lineDiv);

				this.dataDiv = document.createElement('div');
				this.dataDiv.style.position = 'absolute';
				this.dataDiv.style.top = '20px';
				this.dataDiv.style.left = '0px';
				this.dataDiv.style.width = '100';
				this.dataDiv.style.zIndex = 1011;
				this.dataDiv.style.border = '1px solid rgba(255, 255, 255, 0.93)';
				this.dataDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.50)';
				this.dataDiv.style.boxShadow = '4px 4px 8px rgba(0,0,0,0.73)';
				this.dataDiv.style.display = 'none';
				element.appendChild(this.dataDiv);


				//Shadow canvas must be instanced first to render properly
				this.canvasShadow = document.createElement('canvas');
				this.canvasShadow.id = 'gcpChartShadow';
				this.canvasShadow.style.position = 'absolute';
				this.canvasShadow.style.zIndex = 1000;
				element.appendChild(this.canvasShadow);

				//the chart canvas must be instanced second to be on top of the shadow canvas
				this.canvas = document.createElement('canvas');
				this.canvas.id = 'gcpChart';
				this.canvas.style.position = 'absolute';
				this.canvas.style.zIndex = 1001;  //zIndex has no effect, only order of createElement on these canvas-i
				element.appendChild(this.canvas);
				element.appendChild(this.lineDiv);
				this.resetCanvasSize();
				this.makeImages();

				var self = this;
				this.element.addEventListener("mousemove", function(event) {
					if(!self.lastData)
						return;
					if(self.lineDiv.style.display == 'none') {
						self.lineDiv.style.display = '';
						self.dataDiv.style.display = '';
					}
					self.lineDiv.style.left = event.pageX + 'px';
					self.dataDiv.style.left = (event.pageX + 3) + 'px';
					var d = self.lastData[event.pageX*self.gscalar / self.bscalar];
					self.dataDiv.style.top =
						Math.floor(d.average * self.canvas.offsetHeight - self.dataDiv.offsetHeight/2 +
						self.canvas.offsetTop) + 'px';
					self.dataDiv.innerHTML = Math.min(100, Math.round(d.average * 10000)/100) + '%';

				});
				this.element.addEventListener("mouseout", function() {
						self.lineDiv.style.display = 'none';
						self.dataDiv.style.display = 'none';
				});

				return this.canvas;
			},
			resetCanvasSize : function()
			{
				var w = this.element.offsetWidth, h = this.element.offsetHeight - 40;
				this.gscalar = window.devicePixelRatio || 1;
				this.canvas.width = w;
				this.canvas.height = h;
				this.canvasShadow.width = w;
				this.canvasShadow.height = h;
				this.lineDiv.style.height = h+'px';

				this.context = this.canvas.getContext('2d');
				this.contextShadow = this.canvasShadow.getContext('2d');
				this.bscalar = this.context.webkitBackingStorePixelRatio ||
                            this.context.mozBackingStorePixelRatio ||
                            this.context.msBackingStorePixelRatio ||
                            this.context.oBackingStorePixelRatio ||
                            this.context.backingStorePixelRatio || 1;

				if(this.gscalar != this.bscalar)
				{	//This is adjusting the canvas for High Definition Displays like Apple Retina
					var ratio = this.gscalar / this.bscalar;
					this.canvas.style.width = w + 'px';
					this.canvas.style.height = h + 'px';
					this.canvas.width = w * ratio;
					this.canvas.height = h * ratio;
					this.context.scale(ratio, ratio);

					this.canvasShadow.style.width = w + 'px';
					this.canvasShadow.style.height = h + 'px';
					this.canvasShadow.width = w * ratio;
					this.canvasShadow.height = h * ratio;
					this.contextShadow.scale(ratio, ratio);
				}
				this.lastCanvasWidth = this.canvas.offsetWidth;
			},
			makeImages : function()
			{
				if(this.bgImage && this.bgImage.width == this.canvas.width)
					return;
				if(this.bgImage)
					delete this.bgImage;

				var self = this;
				var svg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid meet' width='"
				+this.canvas.width+"' height='" + this.canvas.height + "'><defs><linearGradient id='g' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#FF00FF;stop-opacity:1' /><stop offset='1%' style='stop-color:#FF0000;stop-opacity:1' /><stop offset='3.5%' style='stop-color:#FF4000;stop-opacity:1' /><stop offset='6%' style='stop-color:#FF7500;stop-opacity:1' /><stop offset='11%' style='stop-color:#FFB000;stop-opacity:1' /><stop offset='22%' style='stop-color:#FFFF00;stop-opacity:1' /><stop offset='50%' style='stop-color:#00df00;stop-opacity:1' /><stop offset='90%' style='stop-color:#00df00;stop-opacity:1' /><stop offset='94%' style='stop-color:#00EEFF;stop-opacity:1' /><stop offset='99%' style='stop-color:#0034F4;stop-opacity:1' /><stop offset='100%' style='stop-color:#440088;stop-opacity:1' /></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)' /></svg>";
				this.bgImage = new Image();

				this.bgImage.width = this.canvas.width - this.dotSize/2 * this.gscalar / this.bscalar;
				this.bgImage.height = this.canvas.height;
				this.bgImage.src = "data:image/svg+xml;base64,"+btoa(svg);
				this.bgImage.onload = function()
				{
					self.context.drawImage(self.bgImage, 0, 0, self.bgImage.width, self.bgImage.height,
						0, 0, self.canvas.offsetWidth, self.canvas.offsetHeight);
					if(self.imgBuffer)
						delete self.imgBuffer;
					self.imgBuffer = self.context.getImageData(0,0,self.bgImage.width, self.bgImage.height);
					for(y = 0; y < self.bgImage.height; y++)
						for(x = 0; x < self.bgImage.width; x++)
							self.imgBuffer.data[(y * self.bgImage.width + x) * 4 + 3] = 0;
 					self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
				}
			},
			renderChart : function(data)
			{
				this.lastData = data;
				var w = this.canvas.offsetWidth, h = this.canvas.offsetHeight, ch = this.canvas.height;
				var inv_ch = 1.0 / ch;

				var imgShadowBuffer = this.contextShadow.createImageData(this.bgImage.width, this.bgImage.height);

				//Set the alpha for just the graph pixels
				for(i = 0; i < data.length; i++)
				{
					if((data[i].bottom - data[i].top) < inv_ch)
						if(data[i].top > 0.5)
							data[i].top -= inv_ch;
					for(y = Math.floor(data[i].top * ch); y < data[i].bottom * ch; y++)
					{
						var ys = y / ch;
						var a = 0;
						if(ys > data[i].q1 && ys <= data[i].q3 || (data[i].bottom - data[i].top) < inv_ch * 1.5)
							a = 1;
						else if(ys > data[i].top && ys <= data[i].q1)
							a = (ys - data[i].top) / (data[i].q1 - data[i].top);
						else if(ys > data[i].q3 && ys <= data[i].bottom)
							a = (data[i].bottom - ys) / (data[i].bottom - data[i].q3);
						this.imgBuffer.data[(i + y * this.bgImage.width)*4 + 3] = 255*a;
						imgShadowBuffer.data[(i + y * this.bgImage.width)*4 + 3] = Math.pow(a,0.75)*255;
					}
				}
				//blur the shadow
				stackBlurCanvasAlpha(imgShadowBuffer.data, this.bgImage.width, this.bgImage.height, 6);

 				this.contextShadow.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.contextShadow.globalAlpha = 1.0;
				this.contextShadow.putImageData(imgShadowBuffer, this.shadowOffset, this.shadowOffset);

 				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.context.globalAlpha = 1.0;
				this.context.putImageData(this.imgBuffer, 0, 0);

				//reset the alpha for just the graph pixels back to transparent
				for(i = 0; i < data.length; i++)
					for(y = Math.floor(data[i].top * ch); y < data[i].bottom * ch; y++)
						this.imgBuffer.data[i*4 + y * this.bgImage.width*4 + 3] = 0;

				delete imgShadowBuffer;
			}
		},

		initialize : function(id, clickUrl)
		{
			var self = this;

			this.element = document.getElementById(id);
			dotscript = document.createElement('script');
			dotscript.type='text/javascript';
			dotscript.src='gcpdot.js';
			dotscript.onload = function() {
					dot = document.createElement('div');
					dot.id = 'gcpdot' + Math.floor(Math.random() * 1000000);
					dot.style.position = 'absolute';
					dot.style.top = (self.canvas.offsetHeight + self.canvas.offsetTop + 2) + 'px';
					dot.style.right = (self.canvas.offsetWidth + self.graphics.dotSize) / 2 + 'px';
					dot.style.width = self.graphics.dotSize + 'px';
					dot.style.height = self.graphics.dotSize + 'px';
					dot.style.zIndex = 10000;
					dot.style.opacity = 1;
					self.element.appendChild(dot);
					gcpdot = gcpdot_initialize(dot.id);
					gcpdot.setColorFunc = function(scale) {
							if(scale < 0)
							{
								dot.style.top = (self.canvas.offsetHeight + self.canvas.offsetTop + 2) + 'px';
								dot.style.right = (self.canvas.offsetWidth + self.graphics.dotSize) / 2 + 'px';
								return;
							}
							dot.style.top = (self.canvas.offsetTop + self.graphics.canvas.offsetHeight * scale - self.graphics.dotSize /2 + 1) + 'px';
							dot.style.right = '0px';
						}
				};
			this.element.appendChild(dotscript);
			this.element.appendChild(header = document.createElement('div'));
			header.style.position = 'absolute';
			header.style.textAlign = 'center';
			header.style.height = '20px';
			header.style.width = '100%';
			header.style.top = '0px';
			header.style.backgroundColor = 'rgba(250, 250, 250, 0.9)';
			header.appendChild(link = document.createElement('a'));
			link.innerHTML = '24 Hour GCP Graph';
			link.href = clickUrl;
			link.style.fontFamily = 'Arial';
			link.style.fontWeight = 'bold';
			link.style.textDecoration = 'none';
			link.style.color = 'black';

			this.canvas = canvas = this.graphics.initialize(this.element);
			canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';
			canvas.style.top = '20px';
			canvas.style.left = '0px';
			this.graphics.canvasShadow.style.backgroundColor = 'rgba(64, 64, 64, .9)';
			this.graphics.canvasShadow.style.top = '20px';
			this.graphics.canvasShadow.style.left = '0px';
			this.graphics.canvasShadow.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';
			this.lastCanvasWidth = canvas.offsetWidth;

			this.element.appendChild(footer = document.createElement('div'));
			footer.style.position = 'absolute';
			footer.style.height = '20px';
			footer.style.width = '100%';
			footer.style.bottom = '0px';
			footer.appendChild(span = document.createElement('span'));
			span.innerHTML = '&nbsp;24 Hours Ago';
			span.style.float = 'left';
			span.style.fontFamily = 'Arial';
			span.style.fontSize = '90%';
			footer.appendChild(span = document.createElement('span'));
			span.innerHTML = 'Now&nbsp;';
			span.style.float = 'right';
			span.style.fontFamily = 'Arial';
			span.style.fontSize = '90%';

			window.addEventListener('resize', function()
			{
				if(self.element.offsetWidth != self.lastCanvasWidth)
				{
					self.graphics.resetCanvasSize();
					//console.log('refresh width: ' + self.canvas.offsetWidth + ' px');
					self.lastCanvasWidth = self.element.offsetWidth;
					if(self.dataLoaderTimeout)
						clearTimeout(self.dataLoaderTimeout);
					self.dataLoaderTimeout = setTimeout(function(){
							self.dataLoaderTimeout = null;
							self.graphics.makeImages();
							self.getData();
						}, 3000);
				}
			});
			this.getData();
		},
		Xhr : function() {
			try{return new XMLHttpRequest();}catch(e){}
			try{return new ActiveXObject("Msxml3.XMLHTTP");}catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}catch(e){}
			try{return new ActiveXObject("Msxml2.XMLHTTP");}catch(e){}
			try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}
			return null;
		},
		getData : function()
		{
			var xhr = this.Xhr(), self = this;
			if(!xhr) return;

			var url = this.dataSource + '?pixels=' +  (this.canvas.width - this.graphics.dotSize) + '&seconds=-86400' //+ '&starting=0'
				+ '&nonce='+Math.round(Math.random()*10000000);
			xhr.open("GET", url, true);
			xhr.setRequestHeader('Content-Type', 'text/plain');
			xhr.ontimeout = function()
			{
				self.dataLoaderTimeout = setTimeout(function() {
						self.dataLoaderTimeout = null;
						self.getData();
					}, Math.random() * 2000 * Math.sqrt(self.errorTime));
				self.errorTime *= 1.5;
				if(self.errorTime > 300)
					self.errorTime = 300;
				return;
			};
			xhr.onerror = function()
			{
				self.dataLoaderTimeout = setTimeout(function() {
						self.dataLoaderTimeout = null;
						self.getData();
					}, self.errorTime * 1000);
				self.errorTime *= 1.5;
				if(self.errorTime > 300)
					self.errorTime = 300;
			};
			xhr.onreadystatechange=function()
			{
				if (xhr.readyState==4 && xhr.status == 200)
				{
					if(!xhr.responseText)
						return xhr.onerror();
					self.errorTime = self.defaultBaseErrorTime;

					var p = /<p(?=.+?(?!\/>)i=["']([\d]+))(?=.+?(?!\/>)a=["']([\.\d]+))(?=.+?(?!\/>)t=["']([\.\d]+))(?=.+?(?!\/>)q1=["']([\.\d]+))(?=.+?(?!\/>)q3=["']([\.\d]+))(?=.+?(?!\/>)b=["']([\.\d]+))/img, r;

					var graph = [];
					do {
						if(r = p.exec(xhr.responseText)) {
							graph[r[1]] = {
									i : r[1],
									top : r[3],
									q1 : r[4],
									average : r[2],
									q3 : r[5],
									bottom : r[6],
								};
						}
					} while(r);
					self.dataLoaderTimeout = setTimeout(function(){
							self.dataLoaderTimeout = null;
							self.getData();
						}, (60 - (((new Date()).getMilliseconds()/1000 - 6.0) % 60) + Math.random() * 30) * 1000);
					self.graphics.renderChart(graph);
				}
			};
			xhr.send();
		}
	};
	chart.initialize(id, 'http://global-mind.org/gcpdot/');
	return chart;
}



/*

The Javascript below is 3rd party: Included.  Unused code is removed, and functions are
updated to handle the pixel data without a canvas nor context.

This is used to create the drop shadow of the GCP chart.

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr:
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];


var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function BlurStack()
{
	//this.r = 0;
	//this.g = 0;
	//this.b = 0;
	this.a = 0;
	this.next = null;
}

function stackBlurCanvasAlpha( pixels, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;


	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum,
	pr, pg, pb, pa, rbs;

	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

		//r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		//g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		//b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

		//r_sum += sumFactor * pr;
		//g_sum += sumFactor * pg;
		//b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for( i = 0; i < radiusPlus1; i++ )
		{
			//stack.r = pr;
			//stack.g = pg;
			//stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			//r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			//g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			//b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3])) * (radiusPlus1 - i);

			//r_in_sum += pr;
			//g_in_sum += pg;
			//b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;
		}


		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa != 0 )
			{
				//pa = 255 / pa;
				//pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
				//pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
				//pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
			} else {
				//pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}

			//r_sum -= r_out_sum;
			//g_sum -= g_out_sum;
			//b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			//r_out_sum -= stackIn.r;
			//g_out_sum -= stackIn.g;
			//b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

			//r_in_sum += ( stackIn.r = pixels[p]);
			//g_in_sum += ( stackIn.g = pixels[p+1]);
			//b_in_sum += ( stackIn.b = pixels[p+2]);
			a_in_sum += ( stackIn.a = pixels[p+3]);

			//r_sum += r_in_sum;
			//g_sum += g_in_sum;
			//b_sum += b_in_sum;
			a_sum += a_in_sum;

			stackIn = stackIn.next;

			//r_out_sum += ( pr = stackOut.r );
			//g_out_sum += ( pg = stackOut.g );
			//b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );

			//r_in_sum -= pr;
			//g_in_sum -= pg;
			//b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}


	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

		yi = x << 2;
		//r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		//g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		//b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);

		//r_sum += sumFactor * pr;
		//g_sum += sumFactor * pg;
		//b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for( i = 0; i < radiusPlus1; i++ )
		{
			//stack.r = pr;
			//stack.g = pg;
			//stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		yp = width;

		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;

			//r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			//g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			//b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3])) * (radiusPlus1 - i);

			//r_in_sum += pr;
			//g_in_sum += pg;
			//b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;

			if( i < heightMinus1 )
			{
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa > 0 )
			{
				pa = 255 / pa;
				//pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
				//pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
				//pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
			} else {
				//pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}

			//r_sum -= r_out_sum;
			//g_sum -= g_out_sum;
			//b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			//r_out_sum -= stackIn.r;
			//g_out_sum -= stackIn.g;
			//b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

			//r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			//g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			//b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));

			stackIn = stackIn.next;

			//r_out_sum += ( pr = stackOut.r );
			//g_out_sum += ( pg = stackOut.g );
			//b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );

			//r_in_sum -= pr;
			//g_in_sum -= pg;
			//b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += width;
		}
	}

}
