$(function(){

$(document).on('click', '#likebtn', function(e) {
  // console.log($(this).val());
  var id = $(this).val();
  $.ajax({
        type: "POST",
        url: "/posts/like",
        data: { id: id },
        dataType: 'json',
         success:function(data){
           //console.log(data);
           if(data.bool === true) {
             $('#likespn'+id).css("color", "#337ab7");
           } else {
             $('#likespn'+id).css("color", "#333");
           }
          $('#likecnt'+id).empty();
          var html = '';
          html += data.cnt + ' Likes';
          $('#likecnt'+id).append(html);
         },
         error: function(err){
           console.log(err);
         }
     });
});



$(document).on('click', '#postComment', function(e) {
  var id = $(this).val();
  var comment = $('#comment'+id).val();

  if(comment != '') {
    $.ajax({
          type: "POST",
          url: "/posts/comment",
          data: { id: id, comment: comment },
          dataType: 'json',
           success:function(data){
             $('#comment'+id).val('');

             var comment = '';
             comment += '<li>';
             comment +=  '<img src="'+data.commentbyimg+'" class="img-circle" style="width:25px;">';
             comment +=  '<a style="font-weight:bold">'+ data.commentby +'</a> '+ data.comment;
             comment += '</li>';
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
