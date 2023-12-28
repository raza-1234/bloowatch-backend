const Express = require("express");
const router = Express.Router();
const {logOut} = require("../controllers/logout")

router.get("/", logOut)

module.exports = router