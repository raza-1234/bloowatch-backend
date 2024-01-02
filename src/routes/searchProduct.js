const Express = require("express");
const router = Express.Router();
const { searchProducts } = require("../controllers/searchProduct")

router.get("/" , searchProducts);

module.exports = router ;