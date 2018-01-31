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
           //console.log(data);
           if(data.bool === true) {
             $('#likespn'+_id).css("color", "#337ab7");
           } else {
             $('#likespn'+_id).css("color", "#333");
           }
          $('#likecnt'+_id).empty();
          var html = '';
          html += data.cnt + ' Likes';
          $('#likecnt'+_id).append(html);
         },
         error: function(err){
           console.log(err);
         }
     });
});



$(document).on('click', '#postComment', function(e) {
  var id = $('#postId').val();
  var comment = $('#comment').val();

  if(comment != '') {
    $.ajax({
          type: "POST",
          url: "/mool/comment",
          data: { id: id, comment: comment },
          dataType: 'json',
           success:function(data){
             $('#comment').val('');

             var comment = '';
             comment += '<li>'+ data.comment +'</li>'
             $('#allcomment'+id).prepend(comment);

             $('#commentcnt'+id).empty();
             var html = '';
             html += data.cnt + ' Comments';
             $('#commentcnt'+id).append(html);
           },
           error: function(err){
             console.log(err);
           }
       });
  }

});


});
