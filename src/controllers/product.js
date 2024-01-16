const {products, cartProducts} = require("../sequelized/models");
const {Op, where} = require("sequelize")
const paging = require("../utils/pagination")

const addProduct = async (req, res) => {
  const { title, quantity, price, category, image } = req.body;

  if (!(title?.trim() && quantity && price && category[0])){
    return res.status(400).json({"message": "Required cannot be empty."})
  }

  try {
    const newProduct = {
      title,
      quantity,
      price, 
      category,
      image
    }
    const addNewProduct = await products.create(newProduct);
    return res.status(200).json(addNewProduct)
  }catch (err){
    console.log(err);
    return res.status(500).json({"errorMessage": err})
  }
}

const getProducts = async (req, res) => {
  const category = req.query.category?.trim();
  const search = req.query.search?.trim();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const {userId} = req

  const skip = (page - 1) * limit
  const queryCondition = {
    order: [['id', 'ASC']],
    include: [
      {
        model: cartProducts,
        where: {
          userId
        },
        required: false
      }
    ],
    limit: limit ,
    offset: skip
  }

  if (!category && search){
    queryCondition.where = {
      title: {
        [Op.like]: `%${search}%`
      }
    }
  } 
  
  if (category && !search){
    queryCondition.where = {
      category: {
        [Op.overlap]: [category]
      }
    }
  }

  try { 

    const { count , rows } = await products.findAndCountAll(queryCondition)
    if (rows.length === 0){
      return res.status(200).json({"message": `No Product Exist.`})
    }

    const dataPagination = paging(page, limit, rows, count);
    return res.status(200).json(dataPagination)
  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  addProduct,
  getProducts
}