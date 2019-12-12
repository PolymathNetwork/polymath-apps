const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.SENDGRID_API_KEY);
const msg = {
  from: { email: 'noreply@polymath.network', name: 'Polymath Network' },
  replyTo: 'noreply@polymath.network',
  to: { email: 'remon@polymath.network', name: 'Remon Nashid' },
  subject: 'Hello 2',
  html: '<html>Content2</html>',
};

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error('SENDGRID_API_KEY not set');
}

(async function() {
  await sgMail.send(msg);
})();
