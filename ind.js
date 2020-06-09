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
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});