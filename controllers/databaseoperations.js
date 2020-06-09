var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;
mongoose.connect('mongodb://manik:admin123@ds245885.mlab.com:45885/chatapp2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//Schemas
var userSchema = new Schema({
		name: String,
		email: String,
		password: String,
	  friends: Array,
    requestedYou: Array,
    youRequested: Array
	});


//Documents / Tables
var user_info =  Model('user_info',userSchema);



//databaseoperations
var saveUserToDatabase = function(req, res) {
  reqBody = req.body;
  console.log('dbsave called...');

  var userDetails={
    name: reqBody.username,
    email: reqBody.useremail,
    password: reqBody.userpassword,
    friends: [],
    youRequested: [],
    requestedYou: []
  };

  user_info(userDetails).save(function(error){
      if(error)
        throw error;
      console.log('Item saved successfully...');
      res.redirect('/login');
  });
}


var verifyPassword = function(req, res){
  var inputPassword = req.query.password;
  var email = req.query.email;
  user_info.findOne({email:email}, function(err,result){
		if(err){
      // throw err;
      res.json({status: "error", error: err});
    }

		if(result != null && result.password == inputPassword){
      console.log('Passwords Matched');
      res.json({success: 1});
		}
    else{
      res.json({success: 0});
    }
	});
}


var verifyUser = function(email, req, res){
  user_info.findOne({email:email}, function(err,result){
    var success = 0;
		if(err){
      // throw err;
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
      // throw err;
      res.json({status: "error", error: err});
    }
    if(result != null){
      success = 1;
      req.session.username = result.name;
      req.session.email = result.email;
      req.session.userId = result._id;
    } else{
      res.send(req.params.id + " user doesn't exist");
    }
    res.render('profile', {data: req.session});
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
  //
  var connectEachOther = function(req, res) {
    // var myID = req.params.myID;
    // var friendID = req.params.friendID;
    //
    // user_info.findOne({_id: myID}, function(err, result) {
    //   result.friends.push(friendID);
    //   result.save();
    // }).then(function(result){
    //   user_info.findOne({_id: friendID}, function(err, result) {
    //     result.friends.push(myID);
    //     result.save();
    //   }).then(function());
    // });
  }


var addContact = function(req, res){
  // var myID = '5ed3e443ee134b64f8b4eafb'; //satish
  // var friendID = '5ed3e3eeee134b64f8b4eafa'; //katna
  var myID = req.params.myID;
  var friendID = req.body.friendID;
  console.log('IN connectBoth');
  user_info.findOne({_id: myID}, function(err, result) {
    if(result.friends.indexOf(friendID) == -1){
        result.friends.push(friendID);
        var item = result.save();
        console.log('Added '+friendID+' as a friend');
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
  // user_info.findByIdAndRemove(friendId).then(function(ad){
  //     res.send('status: Success');
  // });
}
// addContact('5ed3e3eeee134b64f8b4eafa', '5ed3e443ee134b64f8b4eafb');

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
    if(result != null){
      var resArr = []
      for(var i=0;i<result.length; i++){
        resArr.push(result[i].name);
      }
      // console.log(resArr);
    }
    res.json({arr: result});

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
    } else {
      console.log('deleted user '+doc);
      res.json({deletedUser: doc});
    }
  })
}
module.exports = {userSchema:userSchema, saveUserToDatabase: saveUserToDatabase, verifyPassword: verifyPassword, verifyUser: verifyUser, renderUserAt: renderUserAt, showUsers: showUsers, getFriendsFor: getFriendsFor, getInfoOf: getInfoOf, connectEachOther: connectEachOther, addContact: addContact, deleteFriend: deleteFriend, getusers: getusers, deleteUser: deleteUser};
