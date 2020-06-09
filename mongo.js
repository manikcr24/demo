var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;
mongoose.connect('mongodb://manik:admin123@ds245885.mlab.com:45885/chatapp2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var userSchema = new Schema({
		name: String,
		email: String,
		password: String,
	  friends: Array
	});




var user_info =  Model('user_info',userSchema);


var saveUser =  function(){
	console.log('dbsave called...');
  // mongoose.connect('mongodb://manik:admin123@ds217452.mlab.com:17452/cr24db', {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // });
  //
  // mongoose.connect('mongodb://manik:admin123@ds245885.mlab.com:45885/chatapp2',{
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // });
	var userDetails={
		name: 'user.name',
		email: 'user.email',
		password: 'user.password',
		friends: ['manik','katna', 'satish', 'srinu']
	};

	var itemOne = user_info(userDetails).save(function(error){
			if(error) throw error;
			console.log('Item saved successfully...');
	});
}

saveUser();
