const { products } = require("../sequelized/models");
const {Op} = require("sequelize")

const searchProducts = async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  try {
    const getProducts = await products.findAll({
      order: [['id', 'ASC']],
      where: {
        title: {
          [Op.like]: `%${req.query.name}%`
        }
      },
      limit: limit,
      offset: skip
    });
    return res.status(200).json(getProducts)
  } catch (err){
    return res.status(500).json({"errorMessage": err})
  }
}

module.exports = { searchProducts }