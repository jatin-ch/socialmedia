$(document).ready(function(){


  $(document).on('click', '#submitMessage', function(e) {
      var receiver = $('#receiver').val();
      var message = $('#message').val();
      $.ajax({
            type: "POST",
            url: "/chats",
            data: { receiver: receiver, message: message },
            dataType: 'json',
             success:function(data){
              $('#message').val('');
              $('.all-messages').empty();
              var html = '';
              html += '<li>'+ data +'</li>';
              $('.all-messages').prepend(html);
             },
             error: function(err){
               console.log(err);
             }
         });
    });


});
