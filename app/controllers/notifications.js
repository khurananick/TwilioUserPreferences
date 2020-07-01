module.exports = function(router) {
  router.post("/notification/send/:profile_id", async function (req, res) {
    const type = req.body.type;
    if(!type || NotificationTypes.indexOf(type) < 0)
      return res.send({error: "INVALID_NOTIFICATION_TYPE"});

    const preferred_channel = req.body.preferred_channel;
    if(preferred_channel)
      if(["sms", "email", "voice"].indexOf(preferred_channel) < 0)
        return res.send({error: "INVALID_CHANNEL_TYPE"});

    const profile = await ProfileModel.find(req.params.profile_id);
    const resp = await NotificationModel.send(profile, type, preferred_channel, req.body);
    res.send(resp);
  });
};
