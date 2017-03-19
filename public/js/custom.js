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


   // show the page visit
   showPV();
   function showPV() {
      // body...
      var pvcountObj = {pvcount:null};
      var url = "";
      if (window.location.pathname == "/blog/index.html"){
         url = "http://cloud.bmob.cn/fc3679511e55f464/getVisitCount";
      }else{
         url = "http://cloud.bmob.cn/fc3679511e55f464/getCurrPV";
      }
      $.ajax({ 
          url:url,  
          type: "post",
          contentType:"application/json; charset=utf-8",
          dataType:'jsonp', 
          data:'',
          jsonp:'callback', 
          success: function(result) {
             pvcountObj.pvcount= result;
          }      
      });
      var visitcount_vm = new Vue({
         el:"#leftcircle",
         data:pvcountObj
      });
       
   }

   

})