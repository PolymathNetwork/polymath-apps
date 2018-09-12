import sgMail from '@sendgrid/mail';

export default async (email, name, subject, body, replyTo) => {
  const msg = {
    from: { email: 'noreply@polymath.network', name: 'Polymath Network' },
    reply_to: replyTo || {
      email: 'tokenstudio@polymath.zendesk.com',
      name: 'Polymath Network',
    },
    to: { email, name },
    subject,
    html: body,
  };
  if (process.env.SENDGRID_API_KEY) {
    await sgMail.send(msg);
  } else {
    console.log('Not sending email since SENDGRID_API_KEY is not set.', msg);
  }
};
