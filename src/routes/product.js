const Express = require("express")
const router = Express.Router();
const { addProduct, getProducts } = require("../controllers/product")
const {uploadImage} = require("../middlewares/uploadImage")

router.get("/get-products/:category", getProducts)
router.post("/add-product", uploadImage, addProduct)


module.exports = router