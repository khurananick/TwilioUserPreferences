module.exports = function() {
  const TwilioSyncService   = TwilioClient.sync.services(ENV.TWILIO_SYNC_SERVICE_SID);
  const TwilioSyncList      = TwilioSyncService.syncLists(ENV.TWILIO_SYNC_LIST_SID)

  const Self = {
    objectify: function(profile) {
      const attrs = profile.data;
      attrs.id = profile.index;
      return attrs;
    },
    create: async function(attributes) {
      const profile = await TwilioSyncList
                        .syncListItems
                        .create({data: attributes})
                        .catch(function(e) {
                          console.log(e);
                        });
      return Self.objectify(profile);
    },
    list: async function () {
      const profiles = await TwilioSyncList
                        .syncListItems
                        .list()
                        .catch(function(e) {
                          console.log(e);
                        });
      for(let index in profiles) {
        profiles[index] = Self.objectify(profiles[index]);
      }
      return profiles;
    },
    find: async function(index) {
      const profile = await TwilioSyncList
                        .syncListItems(index)
                        .fetch()
                        .catch(function(e) {
                          console.log(e);
                        });
      return Self.objectify(profile);
    },
    update: async function(index, attributes) {
      const profile = await TwilioSyncList
                        .syncListItems(index)
                        .update({data: attributes})
                        .catch(function(e) {
                          console.log(e);
                        });
      return Self.objectify(profile);
    },
    delete: async function(index) {
      await TwilioSyncList
        .syncListItems(index)
        .remove()
        .catch(function(e) { console.log(e); });
      return true;
    }
  };

  return Self;
}
