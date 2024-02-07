const express = require("express");
const router = express.Router();
const { 
  addToCart,
  getCartProducts,
  removeFromCart,
  updateCart
} = require("../controllers/cart_product")

router.post("/addToCart/:id", addToCart);
router.patch("/updateCart/:id", updateCart);
router.delete("/:productId/removeFromCart/:id", removeFromCart);
router.get("/getAllCartProducts/:id", getCartProducts);

module.exports = router