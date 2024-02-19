const { products, cartProducts } = require("../sequelized/models")
const { checkUserById } = require("../utils/checkUser")

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
    res.status(400).json({"message": "Product Id not found."})
    return;
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
        res.status(200).json({"message":  "Product added in cart."})
        return;
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
        return res.status(200).json({"message": "Product added in cart."});
      }
      return res.status(400).json({"message": "Product is out of stock."});
    }
  } catch (err){
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
    res.status(403).json({"message": "Access denied."})
    return;
  }

  if (!productId){
    res.status(400).json({"message": "Product Id not found."})
    return
  }
  
  try {
    const productExist = await products.findOne({
      where: {
        id: productId
      }
    })

    if (!productExist){
      res.status(400).json({"message":`Required product not found.`})
      return;
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
      res.status(200).json({"message":  "Product added in cart."})
      return;
    } 
    res.status(400).json({"message": "Product is out of stock."});
    return;
  } catch (err){
    res.status(500).json({"errorMessage": err})
    return;
  }
}

const removeFromCart = async (req, res) => {
  const productId = Number(req.params.productId)
  const id = Number(req.params.id)
  const { userId } = req

  if (id !== userId){ 
    res.status(403).json({"message": "Access denied."})
    return;
  }

  if (!productId){
    res.status(400).json({"message": "Required parameters should be proper number type."})
    return;
  }

  try {
    const cartItemExist = await cartProducts.findOne({
      where: {
        productId,
        userId: id
      }
    })

    if (!cartItemExist){
      res.status(400).json({"message": "Product already not exist in cart."})
      return;
    }

    await cartItemExist.destroy();
    res.status(200).json({"message": "Item removed from cart"})
    return;
  } catch (err){
    res.status(500).json({"errorMessage": err})
    return;
  }
}

const getCartProducts = async (req, res) => {
  const id = Number(req.params.id);
  const {userId} = req

  if (id !== userId){ 
    res.status(403).json({"message": "Access denied."})
    return;
  }

  try {
    const userExist = await checkUserById(id);
    if (!userExist){
      res.status(400).json({"message":  `userId ${id} does not exist.`})
      return;
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
      res.status(200).json({"message": `No data exists in the cart for the required user.`})
      return;
    }
    res.status(200).json(cartData)
    return;
  } catch (err){
    res.status(500).json({"message": err})
    return;
  }
}

module.exports = {
  addToCart, 
  getCartProducts,
  removeFromCart,
  updateCart
}