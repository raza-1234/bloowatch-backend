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
  const category = req.query?.category?.trim();
  const search = req.query?.search?.trim();
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 3;
  const price = req.query?.price;
  console.log(price);
  const minPrice = Number(price?.[0]) || 0;
  console.log(minPrice);
  const maxPrice = Number(price?.[1]) || 100000;
  console.log(maxPrice)
  const {userId} = req

  console.log(page);

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
      return res.status(200).json({message: 'No Product Found.', data: [], paging: {}})
    }

    const dataPagination = paging(page, limit, rows, count);
    return res.status(200).json(dataPagination)
  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err})
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
      return res.status(400).json({"message": "product not found."})
    }
    return res.status(200).json(product)
  } catch (err){

  }
}

module.exports = {
  addProduct,
  getProducts,
  getProduct
}