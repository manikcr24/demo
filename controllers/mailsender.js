var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'criminalstories8@gmail.com',
    pass: '0001110001001110'
  }
});

var mailOptions = {
  from: 'criminalstories8@gmail.com',
  to: 'manik.cr24@gmail.com',
  subject: 'OTP for ChatApp2',
  text: ''
};


var sendOtp = function(email, OTP) {

  mailOptions.text ='OTP for Signing up for ChatApp2 is '+OTP;
  mailOptions.to = email;
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {sendOtp : sendOtp};






// transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
    //     console.log(error);
    //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
