var Highscore = function() {

	this.high_score = 0;
	this.beaten_record = 0;

	this.load_high_score = function() {
		this.high_score = parseInt(localStorage.getItem('high_score')) || 0;
	}

	this.set_high_score = function(score) {
		localStorage.setItem('high_score', score);
		this.high_score = score;
	}

	this.new_score = function(new_score) {
		console.log(new_score + ' ' + this.high_score);
		if(new_score > this.high_score){
			this.beaten_record++;
			this.set_high_score(new_score);
		}
	}

	this.load_high_score();
}