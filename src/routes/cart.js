const express = require("express");
const router = express.Router();
const { 
  addToCart,
  removeFromCart,
  getCartProducts,
  unCart
} = require("../controllers/cart_product")

router.post("/addToCart/:id", addToCart);
router.delete("/:productId/removeFromCart/:id", removeFromCart);
router.delete("/:productId/unCart/:id", unCart);
router.get("/getAllCartProducts/:id", getCartProducts);

module.exports = router