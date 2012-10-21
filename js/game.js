var Game = function() {

	this.touch = false;

	var columns = 10,
		rows = 5,
		default_width = 480,
		gap = 48;

	if(window.innerWidth > default_width){
		gap = 64;
	}else if(window.innerWidth < default_width){
		gap = 32;
	}

	var score = 0;
	var high_score = new Highscore();

	// Wrapper that holds canvas one on top another
	var wrapper = document.getElementById('wrapper-canvas');

	// Creating main drawing canvas
	var canvas = document.getElementById('canvas1'),
		ctx    = canvas.getContext("2d");

	// Top layer canvas
	var canvas_top = document.getElementById('canvas2'),
		ctx_top    = canvas_top.getContext("2d");

	// Defining canvas, top canvas, wrapper width & height
	var width = canvas.width = canvas_top.width = wrapper.width = (columns * gap);
	var height = canvas.height = canvas_top.height = wrapper.height = (rows * gap);
 	
 	canvas.style.width = canvas_top.style.width = wrapper.style.width = width  + 'px';
 	canvas.style.height = canvas_top.style.height = wrapper.style.height = height  + 'px';

 	var	h_gap  = gap / 2,	// Half
 		q_gap  = gap / 4,	// Quarter
 		o_gap  = gap / 8;	// Octo :)

 	var canvas_matrix = [],
		last_click    = {};

	var render_main = new Render(ctx),
		render_top  = new Render(ctx_top);

 	var colors = {
 		1: 'FF4444',
 		3: '33B5E5',
 		5: 'FFBB33',

 		4: 'AA66CC',
 		6: 'FF8200',
 		8: '99CC00'
 	};

 	var shades = {
 		1: 'CC0000',
 		3: '0099CC',
 		5: 'FF8800',

 		4: '9933CC',
 		6: 'F06500',
 		8: '669900'
 	};

 	var primary_colors = [1, 3, 5];

 	/* Initialization functions */

	this.init = function() {

		this.init_board();
	}

	this.reset = function() {
		score = 0;
		high_score.beaten_record = 0;
		document.getElementById('score-points').innerHTML = score;

		this.init_board();
	}

	this.init_board = function() {
		
		for(var x = 0; x < columns; x++){
			for(y = 0; y < rows; y++){
				if(typeof canvas_matrix[x] == 'undefined')
					canvas_matrix[x] = new Array(columns);

				color = primary_colors[random(0,2)];
				canvas_matrix[x][y] = color;

				this.draw_block(x * gap, y * gap, color);
			}
		}
	}

	/* Check canvas matrix colors for equal mixed color lines */

	this.check_horizontal = function(y) {

		var counter = 0;
			last_color = 0;

		for(var x = 0; x < columns; x++){
			var color = canvas_matrix[x][y],
				is_mixed = mixed_color(color);

			if(is_mixed){
				if(color == last_color){
					counter++;
				}
			}

			// Checking if equal mixed color line is complete
			if(counter >= 3  && (color != last_color || x == (columns - 1))){

				var start_x = (color != last_color ? x - counter : x - counter + 1);

				this.animate_score(counter, shades[canvas_matrix[start_x][y]], gap);
				this.blocks_fall(start_x, y, counter);

				counter = 0;
			}

			if(is_mixed){
				if(color != last_color){
					counter = 1;
				}
			}
			last_color = color;
		}
	}

	this.check_vertical = function(x) {

		var counter = 0,
			last_color = 0;

		for(var y = 0; y < rows; y++){
			var color = canvas_matrix[x][y],
				is_mixed = mixed_color(color);

			if(is_mixed){
				if(color == last_color){
					counter++;
				}
			}

			// Checking if equal mixed color line is complete
			if(counter >= 3  && (color != last_color || y == (rows - 1))){
				var start_y = (color != last_color ? y - counter : y - counter + 1);

				this.animate_score(counter, shades[canvas_matrix[x][start_y]], gap);
				for(var i=0 ; i < counter; i++){
					this.blocks_fall(x, start_y + i, 1);
				}
				this.check_vertical(x);
				counter = 0;
			}

			if(is_mixed){
				if(color != last_color){
					counter = 1;
				}
			}
			last_color = color;
		}
	}

	/* Handle canvas clicks and process logic */

	this.handle_click = function(event) {

		// Check if clicked on canvas
		if(event.target != canvas_top){alert('not_canvas');
			return;
		}

		if(this.touch){
			var click_x = Math.floor(event.clientX / gap),
				click_y = Math.floor(event.clientY / gap);	
		}else{	
			var click_x = Math.floor(event.layerX / gap),
				click_y = Math.floor(event.layerY / gap);
		}

		var color = canvas_matrix[click_x][click_y];

		if(mixed_color(color)){
			return;
		}

		// First click
		if(typeof last_click.color == 'undefined'){
			last_click = {
				x: click_x,
				y: click_y,
				color: color
			}
			this.draw_clicked(click_x * gap, click_y * gap, color);
		}else{
			if(color == last_click.color || distance(click_x, click_y, last_click.x, last_click.y) > 1){
				this.draw_block(last_click.x * gap, last_click.y * gap, last_click.color);
				last_click = {};
				return;
			}
			canvas_matrix[click_x][click_y] = color + last_click.color;

			this.draw_block(click_x * gap, click_y * gap, canvas_matrix[click_x][click_y]);
			this.blocks_fall(last_click.x, last_click.y, 1);

			if(last_click.y < click_y){
				this.check_horizontal(click_y);
				this.check_vertical(click_x);
			}else if(last_click.x != click_x){
				this.check_vertical(click_x);
				this.check_vertical(last_click.x);
			}else{
				this.check_vertical(click_x);
			}
			last_click = {};
		}
	}

	/* Game block falling logic */

	this.blocks_fall = function(x, y, count) {

		// x cycle
		for(var i = 0; i < count; i++){

			var act_x = x + i;

			color = canvas_matrix[act_x][y] = (y > 0 ? canvas_matrix[act_x][y - 1] : primary_colors[random(0, 2)]);
			render_main.clear(act_x * gap, y * gap, gap);
			this.animate_fall(act_x * gap, y * gap - gap, color);

			// y cycle
			for(var n=0; n <= y; n++){

				var act_y = y - n;
				
				color = canvas_matrix[act_x][act_y] = (act_y > 0 ? canvas_matrix[act_x][act_y - 1] : primary_colors[random(0, 2)]);
				render_main.clear(act_x * gap, act_y * gap, gap);
				this.animate_fall(act_x * gap, act_y * gap - gap, color);
			}
		}
				
		// Check all rows that was modified
		for(var n=0; n <= y; n++){

			var act_y = y - n;
			this.check_horizontal(act_y);
		}
	}

	/* Main canvas draw */

	this.draw_block = function(x, y, color) {
		// Draw border 'shades' square
		render_main.square(x, y, gap, shades[color]);
		// Draw main color square
		render_main.square(x + o_gap, y + o_gap, gap - q_gap, colors[color]);
	}

	this.draw_clicked = function(x, y, color) {
		// Draw border shaded square
		render_main.set_color_rgb("rgba(0, 0, 0, 0.2)");
		render_main.square(x, y, gap);
		// Draw main color square
		render_main.square(x + o_gap, y + o_gap, gap - q_gap, colors[color]);
	}

	/* Main canvas animation functions */

	this.animate_fall = function(x, y, color){

		render_main.clear(x, y, gap);
		
		y += q_gap;
		this.draw_block(x, y, color);

		if(y % gap != 0){
			setTimeout(function(){
				game.animate_fall(x, y, color);
			}, 130 - (y % gap));
		}
	}

	this.animate_score = function(new_score, text_color, size) {

		if(size <= gap){
			this.show_score(new_score, text_color, size + h_gap);
			setTimeout(function(){
				game.animate_score(new_score, text_color, size + h_gap);
			}, 1000);
		}else{
			render_top.clear_all( 0, 0, width, height);
		}
	}

	/* Top canvas(effects) functions */

	this.show_score = function(new_score, text_color, size){

		score += new_score;
		document.getElementById('score-points').innerHTML = score;

		high_score.new_score(score);
		if(high_score.beaten_record === 1){
			alert('Awesome, new record! :)');
		}

		document.getElementById('score-img').className = 'rotate';
		setTimeout(function() {
			document.getElementById('score-img').className = '';
		}, 1000);


		render_top.clear_all( 0, 0, width, height);
		render_top.set_color(text_color);
		render_top.text(new_score, width / 2, height / 2, size);
		render_top.stroke_text(new_score, width / 2, height / 2, size, 'FFFFFF');
	}

	this.show_high_score = function() {
		alert('Your high score is ' + high_score.high_score + ' points');
	}

	this.share_fb = function() {
		share_facebook(width, height);
	}

	this.share_tw = function() {
		share_twitter('Hey! I`ve got score of ' + score + ' :D in HTML5 mobile game "Colo"', width, height);
	}
}