
var random = function(from, till) {
	return (Math.floor(Math.random() * ((till - from) + 1) + from));
};

var scroll_top = function() {
	window.scrollTo(0, 1);
}

var mixed_color = function(color) {
	return color % 2 === 0 ? true : false;
}

var distance = function(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

var share_facebook = function(w, h) {
    window.open(
        'http://www.facebook.com/share.php?u=' + encodeURIComponent(location.href),
        '',
        'status=0,scrollbars=0,resizable=0,width='+ w +',height=' + h
 );
 return false;
}

var share_twitter = function(text, w, h)
{
    window.open(
        'http://twitter.com/share?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(text),
        '',
        'location=1,status=1,scrollbars=0,resizable=0,width='+ w +',height=' + h);
    return false;
}