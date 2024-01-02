const express = require("express");
const router = express.Router();
const { addToCart , removeFromCart, getCartProducts} = require("../controllers/cart_product")

router.post("/:productId/addToCart/:userId", addToCart);
router.delete("/:productId/removeFromCart/:userId", removeFromCart);
router.get("/:userId/getAllCartProducts", getCartProducts);

module.exports = router