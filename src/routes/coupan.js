const Express = require("express");
const router = Express.Router();
const { assignCoupan, checkCoupan } = require("../controllers/coupan")

router.post("/", assignCoupan);
router.get("/:name", checkCoupan);

module.exports = router