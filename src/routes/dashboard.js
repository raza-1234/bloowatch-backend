const Express = require("express")
const router = Express.Router()
const {dashboard} = require("../controllers/dashboard")

router.get("/", dashboard)

module.exports = router