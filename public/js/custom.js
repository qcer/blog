$(function () {

	$(window).scroll(function() {
	       if ($(window).scrollTop() > 500)
	           $('div.go-top').show();
	       else
	           $('div.go-top').hide();
	});
   $('div.go-top').click(function() {
   		console.log("ok");
       $('html, body').animate({scrollTop: 0}, 500);
   });

})