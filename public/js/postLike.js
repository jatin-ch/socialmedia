$(function(){

$(document).on('click', '#likebtn', function(e) {
  // console.log($(this).val());
  var _id = $(this).val();
  $.ajax({
        type: "POST",
        url: "/mool/like",
        data: { id: _id },
        dataType: 'json',
         success:function(data){
           console.log(data);
          $('#likecnt'+_id).empty();
          var html = '';
          html += data + ' Likes';
          $('#likecnt'+_id).append(html);
         },
         error: function(err){
           console.log(err);
         }
     });
});


});
