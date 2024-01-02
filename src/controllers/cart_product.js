const {products, cartProducts, users} = require("../sequelized/models")

const addToCart = async (req, res) => {
  const {productId, userId} = req.params;
  const tokenId = req.userId

  if (userId != tokenId){ //matching values only
    return res.status(403).json({"message": "Access denied."})
  }

  if (!(productId.trim().length > 0 && userId.trim().length > 0)){
    return res.status(400).json({"message": "Empty params are not allowed."})
  }
  
  if (isNaN(productId) || isNaN(userId)){
    return res.status(400).json({"message": "productId and userId must be of number type."})
  }

  try {
    const productExist = await products.findOne({
      where: {
        id: productId
      }
    })

    if (!productExist){
      return res.status(400).json({"message":`Product with id ${productId} does not exist.`})
    }

    const cartItemExist = await cartProducts.findOne({
      where: {
        productId,
        userId
      }
    })

    if (cartItemExist){
      if (productExist.quantity > cartItemExist.quantity){
        cartItemExist.quantity ++;
        await cartItemExist.save();
        return res.status(200).json({"message":  "Product added in cart."})
      } 
      return res.status(400).json({"message": "Product is out of stock."});
    } else {
      const newiItemToCart = {
        quantity: 1,
        productId,
        userId
      }
      await cartProducts.create(newiItemToCart);
      return res.status(200).json({"message": "Product added in cart."})
    }
  } catch (err){
    return res.status(500).json({"errorMessage": err})
  }
}

const removeFromCart = async(req, res) => {
  const {productId, userId} = req.params;
  const tokenId = req.userId

  if (userId != tokenId){ //matching values only
    return res.status(403).json({"message": "Access denied."})
  }

  if (!(productId.trim().length > 0 && userId.trim().length > 0)){
    return res.status(400).json({"message": "Empty params are not allowed."})
  }

  if (isNaN(productId) || isNaN(userId)){
    return res.status(400).json({"message": "productId and userId must be of number type."})
  }

  try {
    const cartItemExist = await cartProducts.findOne({
      where: {
        productId,
        userId
      }
    })

    if (!cartItemExist){
      return res.status(400).json({"message": "Product already not exist in cart."})
    }

    if (cartItemExist.quantity > 1){
      cartItemExist.quantity --;
      await cartItemExist.save();
    }
    else {
      await cartItemExist.destroy();
    }

    return res.status(200).json({"message": "Item removed from cart"})
  } catch (err){
    console.log(err);
    return res.status(500).send(err)
  }
}

const getCartProducts = async(req, res) => {
  const { userId } = req.params;
  const tokenId = req.userId

  if (userId != tokenId){ //matching values only
    return res.status(403).json({"message": "Access denied."})
  }

  if (userId.trim().length === 0){
    return res.status(400).json({"message": "Empty params are not allowed."})
  }

  if (isNaN(userId)){
    return res.status(400).json({"message": "productId and userId must be of number type."})
  }

  try {
    const userExist = await users.findOne({
      where: {
        id: userId
      }
    })

    if (!userExist){
      return res.status(400).json({"message": `userId ${userId} does not exist.`})
    }

    const cartData = await cartProducts.findAll({
      where: {
        userId 
      }
    })

    if (cartData.length === 0){
      return res.status(200).json({"message": `No data exist in cart for userId ${userId}`})
    }
    return res.status(200).json(cartData)
  } catch (err){
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  addToCart, 
  removeFromCart,
  getCartProducts
}