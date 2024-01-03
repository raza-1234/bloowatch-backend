const { coupons } = require("../sequelized/models")

const createCoupons = async (req, res) => {
  const { name, discountPercentage } = req.body;

  if (!(name?.trim() && discountPercentage)){
    return res.status(400).json({"message": "Required Fields Are Not Found."})
  }

  const newCoupon =  {
    name:  name.trim(),
    discountPercentage
  }

  try {
    await coupons.create(newCoupon)
    return res.status(200).json({"message": `Coupon ${newCoupon.name} is successfully added.`});
  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err})
  }
}

const checkCoupons = async (req,res) => {
  const { name } = req.params;

  if (!name.trim()){
    return res.status(400).json({"message": "Required parameter is not found."})
  }

  try {
    const couponExist = await coupons.findOne({
      where: {
        name: name.trim()
      }
    })

    if (!couponExist){
      return res.status(400).json({"message": "Invalid coupan."})
    }
    return res.status(200).json(couponExist)

  } catch (err){
    console.log(err);
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  createCoupons,
  checkCoupons
}