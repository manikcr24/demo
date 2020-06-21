var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
var dateTime = require('node-datetime');
///////////////////////////////
var databaseoperations = require('./controllers/databaseoperations.js');
var mailsender = require('./controllers/mailsender.js');


var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


var userSocketMap = {};
var socketUserMap = {};

io.on('connection', function(socket){
  // console.log(socket.id);

  socket.on('disconnect', function(data) {
    console.log('In Disconnecting SOCKET '+data.msg);
    console.log(socket.id+ ' just went offline...');
    var userId = socketUserMap[socket.id];
    var socketId = socket.id;

    delete userSocketMap[userId];
    delete socketUserMap[socketId];
    console.log('UserSocketMap : '+JSON.stringify(userSocketMap));
    console.log('socketUserMap : '+JSON.stringify(socketUserMap));

    var timeNow = dateTime.create();
    // var formattedData = timeNow.format('d/m/Y H:M');

    databaseoperations.modifyLastSeenInfo(userId, timeNow)
  });

  socket.on('userloggedin', function(data){
    // sockets.push({userId: data.id, socketId: socket.id});
    userSocketMap[data.id] = socket.id;
    socketUserMap[socket.id] = data.id;
    // console.log('user data ' +JSON.stringify(sockets));
    console.log('userSocketMap ' +JSON.stringify(userSocketMap));
    console.log('socketUserMap : '+JSON.stringify(socketUserMap));
  });

  socket.on('send-message', function(data){
    console.log(data.message+' from '+data.from+'/n to '+data.to+'');
    console.log(JSON.stringify(data));
    var fromSocketId = socket.id;
    var from = data.from;
    if(!userSocketMap[data.from]){
      // io.sockets.to()

      // TODO: add some logic to recreate a socket or destroy session.
    }
    /*else*/ if(userSocketMap[data.to]){
        var toSocketId = userSocketMap[data.to];
        // console.log('friend is online');
        data.status = 1;
        io.sockets.to(toSocketId).emit('gotMessage', data);
    }
    else {
      console.log('Friend is Offline');
      // var lastseen = getLastSeenOf(data.to);
      io.sockets.to(fromSocketId).emit('gotMessage', {from: data.to, to: data.from, message: '<b>ServerResponse:</b> Your friend is Offline. This message cannot be delivered. Ask your friend to come online', status: 'findLastSeen'});
    }

  });
  socket.on('i-am-typing', function(data) {
    var fromSocketId = socket.id;
    var from = data.from;
    if(userSocketMap[data.to]){
        var toSocketId = userSocketMap[data.to];
        // console.log('friend is online');
        io.sockets.to(toSocketId).emit('somebody-is-typing', data);
    }
  });

  socket.on('send-friend-request-to', function(data) {
    if(userSocketMap[data.friendId]){
        var toSocketId = userSocketMap[data.friendId];
        // console.log('friend is online');
        io.sockets.to(toSocketId).emit('you-got-a-friend-request', {requestFrom: data.myId, requestTo: data.friendId});
    }
  })



})



app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: '1234@manik'
}));
app.use(express.static('./assets'));
console.log("manik logger")
var currentOTP;
var prevOTP;
function OTPGenerator(){
  prevOTP = currentOTP;
  currentOTP = (Math.floor(100000 + Math.random() * 900000)).toString();
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ '+currentOTP);
  return {prevOTP: prevOTP, currentOTP: currentOTP};
}


app.get('/', function(req, res) {
  console.log('get request on /')
  res.sendFile(__dirname + '/html/index.html');
});



app.get('/login', function(req, res) {
  console.log("get request at /login");
  // console.log(req.session);
  res.sendFile(__dirname + '/html/login.html');
});
app.post('/login', urlencodedParser, function(req, res) {
	console.log(JSON.stringify(req.body));
  // req.session.username = req.body.inputEmail;
  var userDetails = databaseoperations.verifyLogin(req, res);
  // console.log('in login post: '+JSON.stringify(userDetails));
  if(userDetails)
    res.render('home', {data: userDetails});
  res.send('Wrong credentials');
});



app.get('/userverify', function(req, res){
  console.log('get request on /userverify with '+req.query.email);
  var email = req.query.email;
  databaseoperations.verifyUser(email, req, res); //.then(function(){
  //   console.log('#################### Valid USer');
  // });
});


app.get('/logout', function(req, res){
  req.session.destroy(); // = null;
  res.redirect('/login');
});

app.get('/forgotpassword', function(req, res){
  res.sendFile(__dirname + '/html/forgotpassword.html');
})
app.post('/forgotpassword', urlencodedParser, function(req, res){
  console.log(req.body);
  databaseoperations.forgotPasswordReset(req, res);
  // res.json({success: 1})
})

app.get('/signup', function(req, res) {
  console.log("get request at /signup");
  res.sendFile(__dirname + '/html/signup.html');
});
app.post('/signup', urlencodedParser, function(req, res) {
  console.log("Post request at /signup "+JSON.stringify(req.body));
  databaseoperations.saveUserToDatabase(req, res);
  // req.session.username = req.body.username;
  // res.redirect('/home');
});

app.get('/getstatus/:id', function(req, res){
  console.log('this is getStatus/id');
  var status = 0; //offline
  if(userSocketMap[req.params.id]){
    status = 1; //online
    res.json({status: status});
  }else{
    databaseoperations.getLastSeenInfo(req, res);
  }

})

app.get('/home', function(req, res){
  // res.send("<h1>"+req.session.username+"</h1>")
  console.log('Get request on /HOME');
  // console.log(req.session);
  if(req.session.username)
    res.render('home', {data: req.session});
  else
    res.redirect('/login');
});

app.get('/passwordverify', function(req, res){
  console.log('get request on /passwordverify ');
  databaseoperations.verifyPassword(req, res);
  // res.send({success: 0});
})

app.get('/otp', function(req, res) {
  console.log('get request on /otp');
  // var OTP = (Math.floor(100000 + Math.random() * 900000)).toString();
  var receiver = req.query.email;
  var OTP = OTPGenerator().currentOTP;
  mailsender.sendOtp(receiver, OTP);
  res.json({name: 'OTP', value: OTP});
});

app.get('/otpvalidator', function(req, res){
  console.log('get request on /validateotp');
  // var sendOTP = OTPGenerator().prevOTP;
  var enteredOTP = req.query.OTP;
  var actualOTP = req.query.actualOTP;
  console.log('actualOTP : '+actualOTP);
  console.log('enteredOTP : '+enteredOTP );
  // console.log(req);
  success = 0;
  if(actualOTP == enteredOTP)
    success = 1;
  res.json({success: success});
})




app.get('/profile/:id', function(req, res){
  console.log(req.params.id);
  databaseoperations.renderUserAt(req, res);
})

app.get('/profile', function(req, res){
  var data = {name: 'Manik Cheruku', role: 'Software Engineer', phone: 7036722360, email: 'manik.cr24@gmail.com'}
  res.render('profile', data);
})

app.get('/showusers', function(req, res){
  console.log('get request on /getfriends');
  databaseoperations.showUsers(req, res);
})

app.get('/users', function(req, res){
  databaseoperations.getusers(req, res);
});

app.get('/users/:id', function(req, res){
  console.log('RETRIEVING INFO FOR : '+req.params.id);
  databaseoperations.getInfoOf(req, res);
});

app.get('/users/:id/requestlist', function(req, res){
  console.log('RETRIEVING REQUEST LIST ');
  databaseoperations.getFriendRequestList(req, res);
})

app.post('/users/:id/requestlist/', function(req, res){
  console.log('Adding '+req.body.friendId+' to '+req.params.id+'\'s requestList');
  databaseoperations.addToRequestList(req, res);
});

app.delete('/users/:id/requestlist/:friendId', function(req, res){
  console.log('Deleting '+req.params.friendId+' from '+req.params.id+'\'s requestList');
  databaseoperations.deleteFromRequestList(req, res);
})

app.delete('/users/:id', function(req, res){
  console.log('Delete request for user '+req.params.id);
  databaseoperations.deleteUser(req, res);
})

app.get('/users/:myID/addfriend/:friendID', function(req, res){
  console.log('get Request on Longest URL, which I have ever created '+JSON.stringify(req.params));
  databaseoperations.addContact(req, res);
});

app.get('/users/:id/friends', function(req, res){
  console.log('get req on /getusers : '+req.params.id);
  databaseoperations.getFriendsFor(req, res);
});

app.post('/users/:myID/friends', function(req, res){
  console.log('POST Request on Longest URL, which I have ever created '+JSON.stringify(req.params));
  console.log(req.body);
  databaseoperations.addContact(req, res);
});

// '/users/:id/friends'
app.delete('/users/:userid/friends/:friendId', function(req, res){
  console.log('delete request on /users/'+req.params.userid+'/friends/'+req.params.friendId+'/');
  console.log(req.params);
  databaseoperations.deleteFriend(req, res);
});

app.get('/:any', function(req, res){
  console.log('In any');
  res.redirect('/');
})

http.listen(PORT, function(){
  console.log('listening on *:='+PORT);
});
