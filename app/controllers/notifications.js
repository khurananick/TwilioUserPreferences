module.exports = function(router) {
  async function sendEmailNotification(email, params) {
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
    const resp = await sgMail.send(msg).catch(function() {
      console.log(err);
    });
    return resp[0].headers['x-message-id'];
  }

  async function sendSMSNotification(num, body) {
    if(!body) return { error: "INVALID_BODY" };
    const message = await TwilioClient.messages
      .create({
        body: body,
        from: ENV.FROM_NUMBER,
        to: num
      });
    return message.sid;
  }

  async function sendVoiceNotification(num, body) {
    if(!body) return { error: "INVALID_BODY" };
    const call = await TwilioClient.calls
      .create({
         twiml: `<Response><Pause length="3" /><Say>${body}</Say></Response>`,
         to: num,
         from: ENV.FROM_NUMBER
       });
    return call.sid;
  }

  async function sendNotification(profile, type, preferred_channel, params) {
    const prefs = profile.notification_preferences;
    const body = params.body;

    if(prefs[type])
      if(prefs[type][preferred_channel]) {
        if(preferred_channel == "voice")
          return await sendVoiceNotification(profile.phone, body);
        else if(preferred_channel == "email")
          return await sendEmailNotification(profile.email, params);
        else
          return await sendSMSNotification(profile.phone, body);
      }
      else if (prefs[type].email)
        return await sendEmailNotification(profile.email, params);
      else if (prefs[type].voice)
        return await sendVoiceNotification(profile.phone, body);
      else
        return await sendSMSNotification(profile.phone, body);
  }

  router.post("/notification/send/:profile_id", async function (req, res) {
    const type = req.body.type;
    if(!type || NotificationTypes.indexOf(type) < 0)
      return res.send({error: "INVALID_NOTIFICATION_TYPE"});

    const preferred_channel = req.body.preferred_channel;
    if(preferred_channel)
      if(["sms", "email", "voice"].indexOf(preferred_channel) < 0)
        return res.send({error: "INVALID_CHANNEL_TYPE"});

    const profile = await ProfileModel.find(req.params.profile_id);

    const resp = await sendNotification(profile, type, preferred_channel, req.body);

    res.send(resp);
  });
};
