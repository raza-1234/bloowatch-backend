const Express =  require("express");
const router = Express.Router()
const {verifyEmail} = require("../controllers/verifyEmail")

router.put("/verify_email/:id", verifyEmail)

module.exports = router