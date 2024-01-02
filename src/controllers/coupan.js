const { coupans } = require("../sequelized/models")

const assignCoupan = async (req, res) => {
  const { name, discountPercentage } = req.body;

  if (!(name && name.trim().length > 0 && discountPercentage)){
    return res.status(400).json({"message": "Required Fields Are Not Found."})
  }

  try {
    await coupans.create({ name, discountPercentage })
    return res.status(200).json({"message": `Coupan ${name} is successfully added.`});
  } catch (err){
    return res.status(500).json({"message": err})
  }
}

const checkCoupan = async (req,res) => {
  const { name } = req.params;

  try {
    const coupanExist = await coupans.findOne({
      where: {
        name
      }
    })

    if (!coupanExist){
      return res.status(400).json({"message": "Invalid coupan."})
    }
    return res.status(200).json(coupanExist)

  } catch (err){
    return res.status(500).json({"message": err})
  }
}

module.exports = {
  assignCoupan,
  checkCoupan
}