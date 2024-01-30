const Express = require("express");
const router = Express.Router();
const {userDetail} = require("../controllers/userDetail")

router.get("/:id", userDetail );

module.exports = router