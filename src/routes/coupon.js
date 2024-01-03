const Express = require("express");
const router = Express.Router();
const { createCoupons, checkCoupons } = require("../controllers/coupon")

router.post("/", createCoupons);
router.get("/:name", checkCoupons);

module.exports = router