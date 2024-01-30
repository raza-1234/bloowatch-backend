const {products, cartProducts} = require("../sequelized/models")
const {checkUserById} = require("../utils/checkUser")

const addToCart = async (req, res) => {
  const {
    params: {
      id
    }, 
    body:{
      productId,
      quantity,
    }, 
    userId
  } = req;

  if (Number(id) !== userId){ 
    return res.status(403).json({"message": "Access denied."})
  }

  if (!productId){
    return res.status(400).json({"message": "Required parameters should be proper number type."})
  }
  
  try {
    const productExist = await products.findOne({
      where: {
        id: productId
      }
    })

    if (!productExist){
      return res.status(400).json({"message":`Required product not found.`})
    }

    const cartItemExist = await cartProducts.findOne({
      where: {
        productId,
        userId: id
      }
    })

    if (cartItemExist){
      if (productExist.quantity >= (cartItemExist.quantity + quantity)){
        cartItemExist.quantity = cartItemExist.quantity + quantity;
        await cartItemExist.save();
        return res.status(200).json({"message":  "Product added in cart."})
      } 
      return res.status(400).json({"message": "Product is out of stock."});
    } else {
      if (productExist.quantity >= quantity){
        const newItemToCart = {
          quantity,
          productId,
          userId: id
        }
        await cartProducts.create(newItemToCart);
        return res.status(200).json({"message": "Product added in cart."})
      }

      return res.status(400).json({"message": "Product is out of stock."});
    }
  } catch (err){
    console.log(err);
    return res.status(500).json({"errorMessage": err})
  }
}

const updateCart = async (req, res) => {
  const {
    params: {
      id
    }, 
    body:{
      productId,
      quantity,
    }, 
    userId
  } = req;

  if (Number(id) !== userId){ 
    return res.status(403).json({"message": "Access denied."})
  }

  if (!productId){
    return res.status(400).json({"message": "Required parameters should be proper number type."})
  }
  
  try {
    const productExist = await products.findOne({
      where: {
        id: productId
      }
    })

    if (!productExist){
      return res.status(400).json({"message":`Required product not found.`})
    }

    const cartItemExist = await cartProducts.findOne({
      where: {
        productId,
        userId: id
      }
    })

    if (productExist.quantity >= (quantity)){
      cartItemExist.quantity = quantity;
      await cartItemExist.save();
      return res.status(200).json({"message":  "Product added in cart."})
    } 
    return res.status(400).json({"message": "Product is out of stock."});
  } catch (err){
    console.log(err);
    return res.status(500).json({"errorMessage": err})
  }
}

const removeFromCart = async (req, res) => {
  const productId = Number(req.params.productId)
  const id = Number(req.params.id)
  const { userId } = req

  if (id !== userId){ 
    return res.status(403).json({"message": "Access denied."})
  }

  if (!productId){
    return res.status(400).json({"message": "Required parameters should be proper number type."})
  }

  try {
    const cartItemExist = await cartProducts.findOne({
      where: {
        productId,
        userId: id
      }
    })

    if (!cartItemExist){
      return res.status(400).json({"message": "Product already not exist in cart."})
    }

    await cartItemExist.destroy();
    return res.status(200).json({"message": "Item removed from cart"})
  } catch (err){
    console.log(err);
    return res.status(500).send(err)
  }
}

const getCartProducts = async (req, res) => {
  const id = Number(req.params.id);
  const {userId} = req

  if (id !== userId){ 
    return res.status(403).json({"message": "Access denied."})
  }

  try {
    const userExist = await checkUserById(id);
    if (!userExist){
      return res.status(400).json({"message":  `userId ${id} does not exist.`})
    }

    const cartData = await cartProducts.findAll({
      where: {
        userId: id
      },
      order: [
        ['id', 'ASC'],
      ],
      include: [products]
    })

    if (cartData.length === 0){
      return res.status(200).json({"message": `No data exists in the cart for the required user.`})
    }
    return res.status(200).json(cartData)
  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  addToCart, 
  getCartProducts,
  removeFromCart,
  updateCart
}