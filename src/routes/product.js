const Express = require("express")
const router = Express.Router();
const { addProduct, getProducts, getProduct } = require("../controllers/product")
const {uploadImage} = require("../middlewares/uploadImage")
const { verifyToken } = require("../middlewares/verifyToken")

router.get("/get-products", verifyToken, getProducts)
router.get("/get-product/:productId", verifyToken, getProduct)
router.post("/add-product", uploadImage, addProduct)


module.exports = router