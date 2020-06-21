function createFriendRequestAndAddtoList(requestFrom, requestTo){
  $.ajax({
    type: 'GET',
    data: {id: requestFrom},
    url: '/users/'+requestFrom,
    success: function(data) {
      response = data[0];
      var friend = { name: response.name,
                     status: 'Unknown',
                     ID: response._id,
                     friends: response.friends,
                     email: response.email
                   };
      var data = {name: friend.name, id: friend.ID, email: friend.email}
      var requestedFriendElement = createFriendRequestElement(data);

      document.getElementById('friendRequests').appendChild(requestedFriendElement);
    }
  });
}

function removeFromRequestList(myId, friendId) {
  $.ajax({
    type: 'DELETE',
    url: '/users/'+myId+'/requestlist/'+friendId,
    data: {friendId: friendId},
    success: function(response) {
      console.log(JSON.stringify(response));
    }
  })
}


function createContactAndChatBoxFor(friendId, messageEle) {
  // var friendId = friends[i];
  $.ajax({
    type: 'GET',
    url: '/users/'+friendId,
    success: function(response){
      response = response[0];
      var friend = { name: response.name,
                     status: 'Unknown',
                     ID: response._id,
                     friends: response.friends
                   };
      var contactFormatForChat = {contactID: friend.ID, contactName: friend.name, status: friend.status};
      createContactAndChatBox(friend, contactFormatForChat, messageEle);

    }
  });
  availableChats.push(friendId);
}



function getStatus(id) {
  $.ajax({
    type: 'GET',
    url: '/getstatus/'+id,
    success: function(response){
      console.log(JSON.stringify(response));
      if(response.status == 1){
        $('#chat-header-for-'+id).children().children()[1].innerHTML = "Online";
      }
      else if(response.status == 0){
        $('#chat-header-for-'+id).children().children()[1].innerHTML = "Offline";
      }
      else{
        $('#chat-header-for-'+id).children().children()[1].innerHTML = response.status;
      }
    }
  });
}


function createContactAndChatBox(friend, contactFormatForChat, messageEle) {
  var contact = createContactFor(friend, messageEle);
  var chatBox = createNewChatfor(contactFormatForChat);
  if(messageEle){
    chatBox.children[1].children[0].children[0].appendChild(messageEle); // appendChild(messageEle);
    // add message counter as 1
    // $('#contact-'+friend.ID).children().children().children().children()[1].children[0].innerHTML = 1;
  }
  $('#contacts').prepend(contact);
  // document.getElementById('contacts').appendChild(contact);
  document.getElementById('chats-container').appendChild(chatBox);
}
