let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'varisharashid01@gmail.com',
    pass: 'mqwq jllx jtaq awdu'
  }
});


function sendJobApplicationConfirmation(applicant, job) {
  const mailOptions = {
    from: 'varisharashid01@gmail.com',
    to: applicant.email,
    subject: 'Applied to Job successfully',
    text: `Your application has been submitted with following details:
        Job Role: ${job.title},
        Job Salary: ${job.salary}
       `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = sendJobApplicationConfirmation;