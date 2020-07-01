module.exports = function() {
  const Self = {
    send: async function(profile, type, preferred_channel, params) {
      const prefs = profile.notification_preferences;
      const body = params.body;
      if(prefs[type])
        if(prefs[type][preferred_channel]) {
          if(preferred_channel == "voice")
            return await Self.voice(profile.phone, body);
          else if(preferred_channel == "email")
            return await Self.email(profile.email, params);
          else
            return await Self.sms(profile.phone, body);
        }
        else if (prefs[type].email)
          return await Self.email(profile.email, params);
        else if (prefs[type].voice)
          return await Self.voice(profile.phone, body);
        else
          return await Self.sms(profile.phone, body);
    },
    voice: async function(num, body) {
      if(!body) return { error: "INVALID_BODY" };
      const call = await TwilioClient.calls
        .create({
           twiml: `<Response><Pause length="2" /><Say loop="0">${body}</Say></Response>`,
           to: num,
           from: ENV.FROM_NUMBER
         });
      return call.sid;
    },
    email: async function(email, params) {
      if(!params.body) return { error: "INVALID_BODY" };
      if(!params.subject) return { error: "INVALID_SUBJECT" };
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(ENV.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: ENV.FROM_EMAIL,
        subject: params.subject,
        html: `<p>${params.body}</p>`,
      };
      const resp = await sgMail.send(msg);
      return resp[0].headers['x-message-id'];
    },
    sms: async function(num, body) {
      if(!body) return { error: "INVALID_BODY" };
      const message = await TwilioClient.messages
        .create({
          body: body,
          from: ENV.FROM_NUMBER,
          to: num
        });
      return message.sid;
    }
  };
  return Self;
}
