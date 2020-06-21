function createSenderTaggedMessage(data) {  //data.taggedMessageContentSender, data.taggedMessageContent,  data.newMessage
    var row = createRow();
    row.classList.add('message-item');
    var colMD12 = createColMD(12);
    var messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add('right');


    var taggedContentEle = createRow();
    taggedContentEle.classList.add('tagged-content');
    taggedContentEle.classList.add('sent-tagged-content');
    var b = document.createElement('b');
    b.innerHTML = data.taggedMessageContentSender;
    b.classList.add('tagged-message-owner-name');

    var p = document.createElement('p');
    p.innerHTML = data.taggedMessageContent;

    taggedContentEle.appendChild(b);
    taggedContentEle.appendChild(p);


    var messageEle = document.createElement('message');
    messageEle.innerHTML = data.newMessage;

    messageDiv.appendChild(taggedContentEle);
    messageDiv.appendChild(messageEle);

    row.appendChild(colMD12);
    colMD12.appendChild(messageDiv);



    var dropdown = createDropDown();
    dropdown.classList.add('float-right');


    row.appendChild(colMD12);
    colMD12.appendChild(messageDiv);
    colMD12.appendChild(dropdown);


    return row;

}

function createReceivedTaggedMessage(data) {   //data.taggedMessageContentSender, data.taggedMessageContent,  data.newMessage
  var row = createRow();
  row.classList.add('message-item');
  var colMD12 = createColMD(12);
  var messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add('left');


  var taggedContentEle = createRow();
  taggedContentEle.classList.add('tagged-content');
  taggedContentEle.classList.add('received-tagged-content');
  var b = document.createElement('b');
  b.innerHTML = data.taggedMessageContentSender;
  b.classList.add('tagged-message-owner-name');

  var p = document.createElement('p');
  p.innerHTML = data.taggedMessageContent;

  taggedContentEle.appendChild(b);
  taggedContentEle.appendChild(p);


  var messageEle = document.createElement('message');
  messageEle.innerHTML = data.newMessage;

  messageDiv.appendChild(taggedContentEle);
  messageDiv.appendChild(messageEle);

  row.appendChild(colMD12);
  colMD12.appendChild(messageDiv);



  var dropdown = createDropDown();
  dropdown.classList.add('float-left');


  row.appendChild(colMD12);
  colMD12.appendChild(messageDiv);
  colMD12.appendChild(dropdown);


  return row;
}





function createTaggedContentPreview(data) {
    // var data = {messageContent: messageContent, messageOwner: messageOwner, currentActiveChatID:  ID};  //datat structure
    var taggedContentPreviewEle = document.createElement('div');
    taggedContentPreviewEle.classList.add('at-input');
    taggedContentPreviewEle.classList.add('input-tagged-content');
    taggedContentPreviewEle.setAttribute('id', 'tagged-content-preview-for-'+data.currentActiveChatID);
    var spanEle = document.createElement('span');
    spanEle.classList.add('close');
    spanEle.innerHTML = 'X';

    var b = document.createElement('b');
    b.innerHTML = data.messageOwner;

    var p = document.createElement('p');
    p.innerHTML = data.messageContent;

    taggedContentPreviewEle.appendChild(spanEle);
    taggedContentPreviewEle.appendChild(b);
    taggedContentPreviewEle.appendChild(p);
    return taggedContentPreviewEle;
}
