const Express = require("express");
const router = Express.Router();
const { createCoupons, checkCoupons } = require("../controllers/coupon");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/", createCoupons);
router.get("/:name", verifyToken ,checkCoupons);

module.exports = router