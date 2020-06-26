module.exports = function(router) {
  router.get("/profiles", async function(req, res) {
    const profiles = await ProfileModel.list(); // get profiles from db.
    res.render("profiles", { title: "Profiles", profiles: profiles });
  });

  router.post("/profiles/create", async function(req, res) {
    if(!req.body.email && !req.body.phone)
      return res.send({ error: "Email Address and Phone Number are required." });
    const profile = await ProfileModel.create(req.body);
    const body = profile ? {success:true} : {error: true}
    res.send(body);
  });

  router.get("/profile/:id", async function(req, res) {
    const profile = await ProfileModel.find(req.params.id); // get profiles from db.
    const body = profile ? profile : {};
    res.send(body);
  });

  router.put("/profile/:id/update", async function(req, res) {
    if(!req.body.email && !req.body.phone)
      return res.send({ error: "Email Address and Phone Number are required." });
    const profile = await ProfileModel.update(req.params.id, req.body);
    const body = profile ? {success:true} : {error: true}
    res.send(body);
  });

  router.get("/profile/:id/preferences", async function(req, res) {
    const profile = await ProfileModel.find(req.params.id); // get profiles from db.
    res.render("preferences", { profile: profile, NotificationTypes: NotificationTypes });
  });

  router.post("/profile/:id/preferences", async function(req, res) {
    let profile = await ProfileModel.find(req.params.id);
    delete profile.id;
    profile.notification_preferences = req.body;
    profile = await ProfileModel.update(req.params.id, profile);
    const body = profile ? {success:true} : {error: true}
    res.send(body);
  });
};
