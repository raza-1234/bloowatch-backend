const { coupons } = require("../sequelized/models")

const createCoupons = async (req, res) => {
  const { name, discountPercentage } = req.body; //name: couponCode

  if (!(name?.trim() && discountPercentage)){
    res.status(400).json({"message": "Required Fields Are Not Found."})
    return;
  }

  const newCoupon =  {
    name:  name.trim(),
    discountPercentage
  }

  try {
    await coupons.create(newCoupon)
    res.status(200).json({"message": `Coupon ${newCoupon.name} is successfully added.`});
    return;
  } catch (err){
    res.status(500).json({"message": err})
    return;
  }
}

const checkCoupons = async (req,res) => {
  const { name } = req.params;

  if (!name.trim()){
    res.status(400).json({"message": "Required parameter is not found."})
    return;
  }

  try {
    const couponExist = await coupons.findOne({
      where: {
        name: name.trim()
      }
    })

    if (!couponExist){
      res.status(400).json({"message": "Invalid coupon."})
      return;
    }
    res.status(200).json(couponExist)
    return;

  } catch (err){
    res.status(500).json({"message": err})
    return
  }
}

module.exports = {
  createCoupons,
  checkCoupons
}