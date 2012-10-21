var Render = function(ctx) {

	this.ctx = ctx;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	this.set_color = function(color) {

		this.ctx.fillStyle = '#' + color;
	}

	this.set_color_rgb = function(color) {

		this.ctx.fillStyle = color;
	}

	this.clear = function(x, y, wh) {
		this.ctx.clearRect(x, y, wh, wh);
	}

	this.clear_all = function(x, y, w, h) {
		this.ctx.clearRect(x, y, w, h);
	}

	this.rect = function(x, y, w, h) {
				
		this.ctx.fillRect(x, y, w, h);
	}

	this.text = function(text, x, y, size) {

		this.ctx.font = 'bold ' + size + 'px Trebuchet MS, Helvetica, sans-serif';
		this.ctx.fillText( text, x, y);
		
	}

	this.stroke_text = function(text, x, y, size, color) {

		this.ctx.lineWidth=3;
		this.ctx.strokeStyle = '#' + color;
		this.ctx.strokeText(text, x, y);		
	}

	this.square = function(x, y, wh, color) {
		
		if(color){
			this.set_color(color);
		}
		this.rect(x, y, wh, wh);
	}
				
}