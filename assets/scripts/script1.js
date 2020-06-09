function createSearchResult(data){
  var searchResult = createRow();
  searchResult.classList.add('search-result');
  searchResult.setAttribute('id', 'search-result-'+data.id);

  var colMD8 = createColMD(8);
  var p = document.createElement('p');
  p.classList.add('font-12');
  p.innerHTML = data.name;

  var colMD4 = createColMD(4);
  var button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.classList.add('add-friend-button');
  button.setAttribute('id', 'add-friend-'+data.id);
  button.innerHTML = 'Add friend';

  colMD4.appendChild(button);
  colMD8.appendChild(p);

  searchResult.appendChild(colMD8);
  searchResult.appendChild(colMD4);

  return searchResult;
}

function createSearchResultForUnfriend(data){
  var searchResult = createRow();
  searchResult.classList.add('search-result');
  searchResult.setAttribute('id', 'search-result-'+data.id);

  var colMD8 = createColMD(8);
  var p = document.createElement('p');
  p.classList.add('font-12');
  p.innerHTML = data.name;

  var colMD4 = createColMD(4);
  var button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('btn-warning');
  button.classList.add('un-friend-button');
  button.setAttribute('id', 'unfriend-'+data.id);
  button.innerHTML = 'Unfriend';

  colMD4.appendChild(button);
  colMD8.appendChild(p);

  searchResult.appendChild(colMD8);
  searchResult.appendChild(colMD4);

  return searchResult;
}

function createChatHeaderFor(newContact) {
  var chatHeader = createRow();
  chatHeader.classList.add('chat-header');
  chatHeader.setAttribute('id', 'chat-header-for-'+newContact.contactID);
  var colMD12 = createColMD(12);
  var h5 = document.createElement('h5');
  h5.innerHTML = newContact.contactName;
  var p = document.createElement('p');
  p.innerHTML = newContact.status;
  colMD12.appendChild(h5);
  colMD12.appendChild(p);
  chatHeader.appendChild(colMD12);
  return chatHeader;
}
function createChatBodyFor(ID){
  var chatBody = createRow();
  chatBody.classList.add('chat-body');
  chatBody.classList.add('overflow-auto');
  chatBody.setAttribute('id', 'chat-body-for-'+ID);

  var colMD12 = createColMD(12);
  var containerFluid = document.createElement('div');
  containerFluid.classList.add('container-fluid');
  colMD12.appendChild(containerFluid);
  chatBody.appendChild(colMD12);
  return chatBody;
}
function createChatFooterFor(ID){
  var chatFooter = createRow();
  chatFooter.classList.add('chat-footer');
  chatFooter.setAttribute('id', 'chat-footer-for-'+ID);
  var colMD12 = createColMD(12);

  chatFooter.appendChild(colMD12);

  var form = document.createElement('form');
  form.classList.add('form-group');
  form.classList.add('message-sender-form');
  colMD12.appendChild(form);
  var formGroup = document.createElement('div');
  formGroup.classList.add('form-group');
  form.appendChild(formGroup);

  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('form-control');
  input.setAttribute('placeholder', 'start typing...');
  input.setAttribute('id', 'message-sender-for-'+ID);
  input.setAttribute('name', 'message-sender');

  formGroup.appendChild(input);
  return chatFooter;
}

function createNewChatfor(newContact){
  var fluidContainerChat = document.createElement('div');
  fluidContainerChat.classList.add('container-fluid');
  fluidContainerChat.classList.add('chat');
  fluidContainerChat.setAttribute('id', 'chat-'+newContact.contactID);

  var chatHeader = createChatHeaderFor(newContact);
  var chatBody = createChatBodyFor(newContact.contactID);
  var chatFooter = createChatFooterFor(newContact.contactID);

  fluidContainerChat.appendChild(chatHeader);
  fluidContainerChat.appendChild(chatBody);
  fluidContainerChat.appendChild(chatFooter);

  return fluidContainerChat;
}

function createColMD(size){
  var colMD = document.createElement('div');
  colMD.classList.add('col-md-'+size);
  return colMD;
}
function createContainerFluid(){
  var containerFluid = document.createElement('div');
  containerFluid.classList.add('container-fluid');
  return containerFluid;
}
function createRow(){
  var row = document.createElement('div');
  row.classList.add('row');
  return row;
}
function createContactFor(data){
  var contactHeader = createRow();
  contactHeader.classList.add('contact-header');
  contactHeader.setAttribute('id','contact-'+data.ID);

  var colMD12 = createColMD(12);

  var contact = createContainerFluid();
  contact.classList.add('contact');

  var row = createRow();

  var colMD10 = createColMD(10);

  var rowA = createRow();

  var b = document.createElement('b');
  b.innerHTML = data.name;

  var rowB = createRow();
  var p = document.createElement('p');
  p.innerHTML = data.status;

  var colMD1 = createColMD(1);
  colMD1.classList.add('center-aligned');

  var span = document.createElement('span');
  span.classList.add('badge');
  span.classList.add('badge-dark');
  // span.innerHTML = '9';


  contactHeader.appendChild(colMD12);
  colMD12.appendChild(contact);
  contact.appendChild(row);
  row.appendChild(colMD10);
  row.appendChild(colMD1);
  colMD10.appendChild(rowA);
  colMD10.appendChild(rowB);
  rowA.appendChild(b);
  rowB.appendChild(p);
  colMD1.appendChild(span);

  return contactHeader;
}

function createSenderMessage(message) {
  var row = createRow();
  var colMD12 = createColMD(12);
  var messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add('right');
  var messageEle = document.createElement('message');
  messageEle.innerHTML = message;

  row.appendChild(colMD12);
  colMD12.appendChild(messageDiv);
  messageDiv.appendChild(messageEle);

  return row;
}

function createReceivedMessage(message) {
  var row = createRow();
  var colMD12 = createColMD(12);
  var messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add('left');
  var messageEle = document.createElement('message');
  messageEle.innerHTML = message;

  row.appendChild(colMD12);
  colMD12.appendChild(messageDiv);
  messageDiv.appendChild(messageEle);

  return row;
}
