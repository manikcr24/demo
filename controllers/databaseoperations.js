var mongoose = require('mongoose');
var dateTime = require('node-datetime');
var Schema = mongoose.Schema;
var Model = mongoose.model;
const MONGO_URL = 'mongodb://*****:********@ds245885.mlab.com:45885/chatapp2';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//Schemas
var userSchema = new Schema({
		name: String,
		email: String,
	  friends: Array,
    requestedYou: Array,
    youRequested: Array
	});

var userPassword = new Schema({
  email: String,
  password: String
});

var lastSeenSchema = new Schema({
  userId: String,
  lastSeen: Object
});


//Documents / Tables
var user_info =  Model('user_info', userSchema);
var user_password = Model('user_password', userPassword);
var last_seen = Model('last_seen', lastSeenSchema);

//databaseoperations
var saveUserToDatabase = function(req, res) {
  reqBody = req.body;
  console.log('dbsave called...');

  var userDetails={
    name: reqBody.username,
    email: reqBody.useremail,
    friends: [],
    youRequested: [],
    requestedYou: []
  };

  var user_password_information = {
    email: reqBody.useremail,
    password: reqBody.userpassword
  };

  user_password(user_password_information).save(function(err){
    console.log('IN USER_PASSWORD_INFORMATION save...');
    if(err){
        // res.json({error: err});
        console.log(err);
    }
  });
  user_info(userDetails).save(function(error, item){
      if(error)
        throw error;
      console.log('Item saved successfully...');

      //create entry in last seen table
      var timeNow = dateTime.create();
      var formattedTimeNow = timeNow.format('d/m/Y H:M');
      var dateTimeArr = formattedTimeNow.split(' ');
      var lastSeen = {date: dateTimeArr[0], time: dateTimeArr[1]};

      var lastSeenInfo = {userId: item._id, lastSeen: lastSeen}

      last_seen(lastSeenInfo).save(function(err, lastSeenItem){
        console.log('Stored last seen info for '+item._id+' as '+JSON.stringify(lastSeenItem));
      });

      res.redirect('/login');
  });
}


var verifyPassword = function(req, res){
  var inputPassword = req.query.password;
  var email = req.query.email;

  user_password.findOne({email: email}, function(err, result){
    if(err){
      res.json({err: err});
    }
    if(result != null && result.password == inputPassword){
      console.log('Passwords Matched');
      res.json({success: 1});
		}
    else{
      console.log('Passwords not Matched');
      res.json({success: 0});
    }
  });
}


var verifyUser = function(email, req, res){
  user_info.findOne({email:email}, function(err,result){
    var success = 0;
		if(err){
      res.json({status: "error", error: err});
    }
    if(result != null){
      success = 1;
      req.session.username = result.name;
      req.session.email = result.email;
      req.session.userId = result._id;
    }
    res.json({success: success});
	});
}


var renderUserAt = function(req, res){
  if(req.params.id.length != 24){
    res.send(req.params.id + " user doesn't exist");
    return;
  }
  user_info.findOne({_id:req.params.id}, function(err,result){
    var success = 0;
		if(err){
      res.json({status: "error", error: err});
    }
    if(result != null){
      success = 1;
      req.session.username = result.name;
      req.session.email = result.email;
      req.session.userId = result._id;
      res.render('profile', {data: req.session});
    } else{
      res.send(req.params.id + " user doesn't exist");
    }
	}).catch(function(err){
    res.send(req.params.id + " user doesn't exist");
  });
  console.log('adfadsfadf');
}

var getFriendsFor = function(req, res) {
  console.log('Getting friends for '+ req.params.id);

  user_info.find({_id: req.params.id}, function(err,result){
		if(err) {
      // throw err;
      res.json({status: "error", error: err});
    }
    // console.log(result)
    var friends;
    if(result != null){
      friends = result[0].friends;
      // console.log(friends);
    }
    res.json({friends: friends});

	});
}

var getInfoOf = function(req, res) {
  var friendId = req.params.id;
  user_info.find({_id: req.params.id}, function(err, result) {
    if(err) {
      console.log('ERROR in RETRIEVING user info for '+friendId);
      res.json({status: "error", error: err});
    }
    else{
      // console.log('INFO OF FRIEND : '+ result);
      res.json(result)
    }
  });
}

var addContact = function(req, res){
  var myID = req.params.myID;
  var friendID = req.body.friendID;
  console.log('IN connectBoth');
  user_info.findOne({_id: myID}, function(err, result) {
    if(result.friends.indexOf(friendID) == -1){
        result.friends.push(friendID);
        var item = result.save();
        console.log('Added '+friendID+' as a friend');

        //put this id into requestlist of friend
        user_info.findOne({_id: friendID}, function(err, result){
          if(err){
            console.log(err)
          }
          else{
            if(result.requestedYou.indexOf(myID)<0 && result.friends.indexOf(myID)<0){
              result.requestedYou.push(myID);
              var item = result.save();
              console.log('Added '+friendID+' into Request list of '+ myID);
            }
          }
        });

    } else{
      console.log('friend already exists');
      req.friendExists = true;
    }
  }).then(function(result){
    // console.log('Friend status '+ result.friendExists);
    user_info.findOne({_id: friendID}, function(err, result1) {
      if(!req.friendExists){
         console.log('friend details '+result1)
         res.json(result1);
         req.friendExists = false;
      }
      else{
        res.json({sucesss: false});
      }
    });
  });


}

var deleteFriend = function(req, res) {
  console.log('in deleteFriend '+JSON.stringify(req.params));

  var userId = req.params.userid;
  var friendId = req.params.friendId;
  console.log(userId+" -- "+friendId);
  user_info.findOne({_id: userId}, function(error, doc) {
    if(error){
      // throw error;
      res.json({status: "error", error: err});
    }
    if(!doc){
      res.json({result: 'Invalid ID'});
    }
    var friends = doc.friends;
    // console.log('Current friend list '+doc.friends);
    var friendIndex = friends.indexOf(friendId);
    // console.log(friendIndex);
    if(friendIndex > -1){
      var deletedFriend = doc.friends.splice(friendIndex, 1);
      // console.log('After splice '+friends);
      doc.friends = friends;
      // console.log('Doc.friends '+doc.friends);
      doc.save(function(error){
        res.json({deletedFriend: deletedFriend, doc: doc});
      });
    } else{
      res.json({status: 'Failed to delete friend, ID does not exist'});
      console.log('friend does not exist');
    }
  })
}

var forgotPasswordReset = function(req, res){
  var email = req.body.email;
  var newPassword = req.body.newPassword;
  user_password.findOne({email: email}, function(err){
    console.log('IN FindOne '+err );
  }).then(function(doc){
    doc.password = newPassword;
    doc.save().then(function(err){
      console.log('PASSWORD UPDATED');
      res.send({success: 1})
    });
  });
}

var showUsers = function(req, res){
  var keyWord = req.query.keyword;
  console.log('IN DBOPS : keyWord is - '+keyWord);
  var search =  new RegExp(keyWord, 'i');    //  /^'+keyWord+'/;
  console.log('Getting all records starting with '+search);
  user_info.find({name: search}, function(err,result){
		if(err) {
      // throw err;
      res.json({status: "error", error: err});
    }
    // console.log(result)
    // if(result != null){
    //   var resArr = []
    //   for(var i=0;i<result.length; i++){
    //     resArr.push(result[i].name);
    //   }
    // }
    else{
      console.log(keyWord.length+' letter ' +result);
      res.json({arr: result});
    }

	});

  //res.json({});
}

var getusers = function(req, res){
  user_info.find({}, function(err, users){
    console.log(users);
    res.json(users);
  })
}


var deleteUser = function(req, res){
  user_info.findOneAndDelete({_id: req.params.id}, function(err, doc){
    if(err){
      res.json({status: "error", error: err});
    }
    else {
      console.log('deleted user '+doc);
      var email = doc.email;
      user_password.findOneAndDelete({email: email}, function(err, deletedUser){
        if(err){
          res.json({status: "error", error: err});
        } else {
          // console.log('deleted user from table1 '+doc);
          console.log('from table2 '+JSON.stringify(deletedUser));
          last_seen.findOneAndDelete({userId: doc._id}, function(err, deletedLastSeen){
            console.log(JSON.stringify(deletedLastSeen));
            res.json({details: doc, logins: deletedUser, lastSeenInfo: deletedLastSeen});
          });
          // return doc;
        }
      });


    }
  });
}

var getFriendRequestList = function(req, res) {
  user_info.find({_id: req.params.id}, function(err,result){
    if(err) {
      res.json({status: "error", error: err});
    }
    var friendRequestList;
    if(result != null){
      friendRequestList = result[0].requestedYou;
    }
    res.json({friendRequestList: friendRequestList});

  });
}

var deleteFromRequestList = function(req, res) {

  var userId = req.params.id;
  var friendId = req.params.friendId;

  user_info.findOne({_id: userId}, function(error, doc) {
    if(error){
      res.json({status: "error", error: err});
    }
    else if(!doc){
      res.json({result: 'Invalid ID'});
    }
    else{
      var requestList = doc.requestedYou;
      var friendIndex = requestList.indexOf(friendId);
      if(friendIndex > -1){
        var deletedrequest= doc.requestedYou.splice(friendIndex, 1);
        doc.requestedYou = requestList;
        doc.save(function(error){
          res.json({deletedrequest: deletedrequest, doc: doc});
        });
      } else{
        res.json({status: 'Failed to delete friend, ID does not exist'});
        console.log('friend does not exist');
      }
    }
  })

}

var addToRequestList = function(req, res) {
  var userId = req.params.id;
  var friendId = req.body.friendId;

  // var myID = req.params.myID;
  var friendID = req.body.friendID;
  console.log('IN addToRequestList');
  user_info.findOne({_id: userId}, function(err, result) {
    if(result.friends.indexOf(friendId)<0 && result.requestedYou.indexOf(friendId) < 0){
        result.requestedYou.push(friendId);
        var item = result.save();
        console.log('Added '+friendId+' into request list');

        //put this id into requestlist of friend
    } else{
      console.log('friend already exists');
      req.friendExists = true;
    }
  })
}


var modifyLastSeenInfo = function(userId, timeNow) {
  var arr = timeNow.format('d/m/Y H:M').split(' ');
  var date = arr[0];
  var time = arr[1];
  console.log('Modifying lastseen info of '+userId+' as '+date+' '+time);

  try{
    if(userId != null){
      last_seen.findOne({userId: userId}, function(err, doc){
        var lastSeen = {date: arr[0], time: arr[1]};
        doc.lastSeen = lastSeen;
        doc.save(function(err, res){
          if(err){
            console.log(err);
          }
        });
      });
    }
  } catch(e){
    console.log('Exception at modifyLastSeenInfo '+JSON.stringify(e));
  }
}

var getLastSeenInfo = function(req, res){
  var userId = req.params.id;
  last_seen.findOne({userId: userId}, function(err, doc){
    var lastSeen = doc.lastSeen;
    var info = lastSeen.date+' '+lastSeen.time;
    var dateTimeNow = dateTime.create();
    var formattedDateTime = dateTimeNow.format('d/m/Y H:M');
    var today = formattedDateTime.split(' ')[0]
    if(lastSeen.date == today){
      info = 'Today '+lastSeen.time
    }
    res.json({status: info});
  });
}

var getLastSeenOf = function(userId){
  last_seen.findOne({userId: userId}, function(err, doc){
    var lastSeen = doc.lastSeen;
    var info = lastSeen.date+' '+lastSeen.time;
    var dateTimeNow = dateTime.create();
    var formattedDateTime = dateTimeNow.format('d/m/Y H:M');
    var today = formattedDateTime.split(' ')[0]
    if(lastSeen.date == today){
      info = 'Today '+lastSeen.time
    }
    return info;
  });
}
module.exports = {userSchema:userSchema, saveUserToDatabase: saveUserToDatabase, verifyPassword: verifyPassword, verifyUser: verifyUser, renderUserAt: renderUserAt, showUsers: showUsers, getFriendsFor: getFriendsFor, getInfoOf: getInfoOf, addContact: addContact, deleteFriend: deleteFriend, getusers: getusers, deleteUser: deleteUser, forgotPasswordReset: forgotPasswordReset, getFriendRequestList: getFriendRequestList, addToRequestList: addToRequestList, deleteFromRequestList: deleteFromRequestList, modifyLastSeenInfo: modifyLastSeenInfo, getLastSeenInfo: getLastSeenInfo};
