const {products, cartProducts} = require("../sequelized/models");
const {Op, where} = require("sequelize")
const paging = require("../utils/pagination")

const addProduct = async (req, res) => {
  const { title, quantity, price, category, image } = req.body;

  if (!(title?.trim() && quantity && price && category[0])){
    res.status(400)
    res.json({"message": "Required cannot be empty."})
    return;
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
    res.status(200)
    res.json(addNewProduct)
    return;
  }catch (err){
    res.status(500)
    res.json({"errorMessage": err})
    return;
  }
}

const getProducts = async (req, res) => {
  const category = req.query?.category?.trim();
  const search = req.query?.search?.trim();
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 3;
  const price = req.query?.price;
  const minPrice = Number(price?.[0]) || 0;
  const maxPrice = Number(price?.[1]) || 100000;
  const {userId} = req

  const skip = (page - 1) * limit
  const queryCondition = {
    order: [['id', 'ASC']],
    where: {
      price: {
        [Op.between]: [minPrice, maxPrice]
      }
    },
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
      [Op.and]: [
        {
          price: {
            [Op.between]: [minPrice, maxPrice]
          },
          title: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
  } 
  
  if (category && !search){
    queryCondition.where = {
      [Op.and]: [
        {
          category: {
            [Op.overlap]: [category]
          },
          price: {
            [Op.between]: [minPrice, maxPrice]
          }
        }
      ]
    }
  }

  try { 
    const { count , rows } = await products.findAndCountAll(queryCondition)
    if (rows.length === 0){
      res.status(200)
      res.json({message: 'No Product Found.', data: [], paging: {}})
      return;
    }

    const dataPagination = paging(page, limit, rows, count);
    res.status(200)
    res.json(dataPagination)
    return;
  } catch (err){
    res.status(500)
    res.json({"message": err})
    return;
  }
}

const getProduct = async (req, res) => {
  const {productId} = req.params;
  const {userId} = req;
  
  try {
    const product = await products.findOne({
      where: {
        id: productId
      },
      include: [
        {
          model: cartProducts,
          where: {
            userId
          },
          required: false
        }
      ],
    })

    if (!product){
      res.status(404)
      res.json({"message": "product not found."})
      return;
    }
    res.status(200)
    res.json(product)
    return
  } catch (err){
    res.status(500)
    res.json({"message": err})
    return
  }
}

module.exports = {
  addProduct,
  getProducts,
  getProduct
}