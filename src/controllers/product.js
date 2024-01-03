const {products} = require("../sequelized/models");
const {Op} = require("sequelize")

const addProduct = async (req, res) => {
  const { title, quantity, price, category } = req.body;
  const imagePath = req.file.path;

  if (!(title?.trim() && quantity && price?.trim() && category?.trim())){
    return res.status(400).json({"message": "All Fields Are Required."})
  }

  try {
    const newProduct = {
      title,
      quantity,
      price,
      category: category.replace(/\s+/g, '').split(","),
      image: imagePath
    }
    const addNewProduct = await products.create(newProduct);
    return res.status(200).json(addNewProduct)
  }catch (err){
    console.log(err);
    return res.status(500).json({"errorMessage": err})
  }
}

const getProducts = async (req, res) => {
  const category = req.params.category.trim();

  if (!category){
    return res.status(400).json({"message": "Category can not be empty."})
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  try {
    const allProducts = await products.findAll({
      order: [['id', 'ASC']],
      where: { 
        category: {
          [Op.overlap]: [category]
        }
      },
      limit: limit,
      offset: skip
    })

    if (allProducts.length === 0){
      return res.status(200).json({"message": `Product of category ${category} does not exist.`})
    }

    return res.status(200).json(allProducts)
  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  addProduct,
  getProducts
}