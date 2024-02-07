const Express = require("express");
const router = Express.Router();
const {editUser} = require("../controllers/editUser")

router.put("/", editUser);

module.exports = router