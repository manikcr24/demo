var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: '573995227131-fc6c4ega8a4aokosrhtda917m43ing5b.apps.googleusercontent.com',
        clientSecret: 'VYyUIsaQziF0IiaCZLFa2lhG'
    }
});

var sendOtp = function(email, OTP) {

  transporter.sendMail({
      from: 'ChatApp2 <criminalstories8@gmail.com>',
      to: email,
      subject: 'OTP for ChatApp2',
      text: 'OTP for Signing up for ChatApp2 is '+OTP,
      auth: {
          user: 'criminalstories8@gmail.com',
          refreshToken: '1//04HwqXTtFZOxqCgYIARAAGAQSNwF-L9Ir67QmOze0J_OD2n5HCe4NslRbTgvXKjCzC3VGyLAn3Bfw_klqVPhhpdPDpWUDvjP_neI',
          accessToken: 'ya29.a0AfH6SMCQFFubcPbam87g36gV8aLJKB5a0mf2EjfNmCt8j27kX764RCNKpWXZmXv5tvE61rIPe7wGaBu1Da7Efr4xMuSie-B2r5JtoE_tz1BoU85CLS_axXp9fZOAs1BvjZVXEAwOihOLEVfL_fz1QlbM679LNdlZJCE',
          expires: 1484314697598
      }
  }, function(err, response){
    if(err){
      console.log('ERROR : '+err)
    } else {
      console.log('Response' + response.response);
      console.log(JSON.stringify(response));
    }
  });

}

var sendMail = function() {

  transporter.sendMail({
      from: "Siri's CApp2 <criminalstories8@gmail.com>",
      to:  'manik.cr24@gmail.com',
      subject: "Update : Siri's CApp2 with 2 new features",
      text: '',
      html: "Hello Siri, <br> Hope you are doing good. <br>This is to inform you that <b>Siri's ChatApp2 </b> has fixed both of your feature requests, <ul> <li>Last seen info </li> <li>Message Tagging </li> </ul> <br> We are gonna provide you these features with next release which going to be happened soon. Will keep you posted. <br> Keep using Siri's ChatApp2. Thank you",
      auth: {
          user: 'criminalstories8@gmail.com',
          refreshToken: '1//04HwqXTtFZOxqCgYIARAAGAQSNwF-L9Ir67QmOze0J_OD2n5HCe4NslRbTgvXKjCzC3VGyLAn3Bfw_klqVPhhpdPDpWUDvjP_neI',
          accessToken: 'ya29.a0AfH6SMCQFFubcPbam87g36gV8aLJKB5a0mf2EjfNmCt8j27kX764RCNKpWXZmXv5tvE61rIPe7wGaBu1Da7Efr4xMuSie-B2r5JtoE_tz1BoU85CLS_axXp9fZOAs1BvjZVXEAwOihOLEVfL_fz1QlbM679LNdlZJCE',
          expires: 1484314697598
      }
  }, function(err, response){
    if(err){
      console.log('ERROR : '+err)
    } else {
      console.log('Response' + response.response);
      console.log(JSON.stringify(response));
    }
  });
}
// sendMail();
// sendOtp('manik.cr24@gmail.com', '984994');

module.exports = {sendOtp : sendOtp};
