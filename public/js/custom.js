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
      var pathname = window.location.pathname;
      if (pathname == "/blog/"){
         url = "https://cloud.bmob.cn/fc3679511e55f464/getVisitCount";
      }else{
         url = "https://cloud.bmob.cn/fc3679511e55f464/getCurrPV";
      }
      $.ajax({ 
          url:url,  
          type: "GET",
          contentType:"application/json; charset=utf-8",
          dataType:'jsonp', 
          data:'',
          jsonp:'callback', 
          // jsonpCallback:"mymethod",
          success: function(data) {
             pvcountObj.pvcount= data.pageView;
          }      
      });
      var visitcount_vm = new Vue({
         el:"#leftcircle",
         data:pvcountObj
      });
       
   }

   

})