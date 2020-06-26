module.exports = function(router) {
  router.get("/", async function(req, res) {
    res.render("index", { title: "Home" });
  });
};
