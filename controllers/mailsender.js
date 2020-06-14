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

// transporter.sendMail({
//     from: 'ChatApp2 <criminalstories8@gmail.com>',
//     to: 'manik.cr24@gmail.com',
//     subject: 'OTP for ChatApp2',
//     text: 'I hope this message gets through!',
//     auth: {
//         user: 'criminalstories8@gmail.com',
//         refreshToken: '1//04HwqXTtFZOxqCgYIARAAGAQSNwF-L9Ir67QmOze0J_OD2n5HCe4NslRbTgvXKjCzC3VGyLAn3Bfw_klqVPhhpdPDpWUDvjP_neI',
//         accessToken: 'ya29.a0AfH6SMCQFFubcPbam87g36gV8aLJKB5a0mf2EjfNmCt8j27kX764RCNKpWXZmXv5tvE61rIPe7wGaBu1Da7Efr4xMuSie-B2r5JtoE_tz1BoU85CLS_axXp9fZOAs1BvjZVXEAwOihOLEVfL_fz1QlbM679LNdlZJCE',
//         expires: 1484314697598
//     }
// });

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


  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
}

// sendOtp('manik.cr24@gmail.com', '984994');

module.exports = {sendOtp : sendOtp};
