$(document).ready(function(){


  $(document).on('click', '#submitMessage', function(e) {
      var receiver = $('#receiver').val();
      var message = $('#message').val();
      if(message != '')
      {
        $.ajax({
              type: "POST",
              url: "/chats/push",
              data: { receiver: receiver, message: message },
              dataType: 'json',
               success:function(data){
                $('#message').val('');
                var html = '';
                html += '<li style="background-color:#0084ff;color:#fff;">'+ data +'</li>';
                $('.all-messages').append(html);
               },
               error: function(err){
                 console.log(err);
               }
           });
      }

    });


    $(document).on('click', '.chat-users-li', function(e) {
        var receiver = $(this).attr('id');
        $.ajax({
              type: "POST",
              url: "/chats",
              data: { receiver: receiver },
              dataType: 'json',
               success:function(data){
                $('#message').val('');
                $('.all-messages').empty();
                var html = '';
                for(var i in data) {
                  if(JSON.stringify(data[i].sender) === JSON.stringify(data[i].user)) {
                    html += '<li style="background-color:#0084ff;color:#fff;margin-left:50%">'+ data[i].message +'</li>';
                  } else {
                    html += '<li><img data-toggle="tooltip" title="'+ data[i].sender.profile.name +'" src="'+ data[i].sender.profile.picture +'" class="img-circle" style="width:20px;margin-right:5px">'+ data[i].message +'</li>';
                  }
                }
                $('.all-messages').append(html);
               },
               error: function(err){
                 console.log(err);
               }
           });
      });


});
