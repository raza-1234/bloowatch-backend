const Express = require("express")
const router = Express.Router();
const { addProduct, getProducts } = require("../controllers/product")
const {uploadImage} = require("../middlewares/uploadImage")
const { verifyToken } = require("../middlewares/verifyToken")

router.get("/get-products", verifyToken, getProducts)
router.post("/add-product", uploadImage, addProduct)


module.exports = router