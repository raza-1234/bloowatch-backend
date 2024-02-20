const { products, cartProducts } = require("../../sequelized/models");
const { Op } = require("sequelize")
const { 
  addProduct,
  getProducts,
  getProduct
} = require("../../controllers/product")
const { buildMockResponse } = require("../helper")

jest.mock("../../sequelized/models")

const mockProductsFindOne = jest.mocked(products.findOne)
const mockProductsCreate = jest.mocked(products.create)
const mockProductsFindAndCountAll = jest.mocked(products.findAndCountAll)

const mockProduct = {
  title: "fake product",
  quantity: 5,
  price: "20$", 
  category: ["category1", "category2"],
  image: "image1.png"
}

const buildMockData = (count) => {
  const mockDataArray = []
  for (let i = 1; i <= count; i++){
    mockDataArray.push({
      title: `fake product ${i}`,
      quantity: 5,
      price: "20$", 
      category: [`category${i}`, `category${i + 1}`],
      image: `image${i}.png`
    })
  }
  return mockDataArray;
}

describe("addProduct", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        ...mockProduct
      }
    }
    res = buildMockResponse();
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should add product", async () => {
    mockProductsCreate.mockResolvedValue(mockProduct)
    await addProduct(req, res)

    expect(mockProductsCreate).toHaveBeenCalledWith(mockProduct)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockProduct)
  })

  it("should return status '400' and error message 'Required cannot be empty.'", async () => {
    req.body.title = "";
    await addProduct(req, res)

    expect(mockProductsCreate).not.toHaveBeenCalledWith(mockProduct)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({"message": "Required cannot be empty."}) 
  })

  it("should return status '500' if an api fails", async () => {
    req.body.title = "fake product"
    const error = new Error("Database Error")
    mockProductsCreate.mockRejectedValue(error)
    await addProduct(req, res)

    expect(mockProductsCreate).toHaveBeenCalledWith(mockProduct) 
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"errorMessage": error}) 
  })
})

describe("getProducts", () => {
let res;
let req;
let pagingInfo;
let category;
let search 
let page 
let limit
let price
let minPrice
let maxPrice
let userId
let queryCondition

  beforeEach(() => {
    req = {
      query: {
        category: "category 1",
        search: "fake search",
        page: "2",
        limit: "3",
        price: ["100", "200"]
      },
      userId: 1 
    }

    res = buildMockResponse()

    category = req.query?.category?.trim();
    search = req.query?.search?.trim();
    page = Number(req.query?.page);
    limit = Number(req.query?.limit);
    price = req.query?.price;
    minPrice = Number(price?.[0]);
    maxPrice = Number(price?.[1]);
    userId = req.userId

    const totalPage = Math.ceil(mockData.count/limit)
    pagingInfo = {
      data: mockData.rows,
      paging: {
        totalCount: mockData.count,
        currentDataCount: mockData.rows.length, 
        currentPage: page,
        totalPage: totalPage, 
        limit: limit,
        moreData: page < totalPage? true: false, 
        nextPage: page < totalPage ? ++page : null
      }
    }

    queryCondition = {
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
            userId: userId
          },
          required: false
        }
      ],
      limit: limit ,
      offset: (page - 1) * limit
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockData = {
    count: 3, 
    rows:  buildMockData(4)
  }

  it("should return data that matches search, when there is search query but no category", async () => {
    req.query.category = "";
    queryCondition.where = {
      [Op.and]: [
        {
          price: {
            [Op.between]: [Number(req.query.price[0]), Number(req.query.price[1])]
          },
          title: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
    mockProductsFindAndCountAll.mockResolvedValue(mockData)
    
    await getProducts(req, res)

    expect(mockProductsFindAndCountAll).toHaveBeenCalledWith(queryCondition)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(pagingInfo)

  })

  it("should return data that matches category, when there is category but no search", async () => {
    req.query.category = "category 1"
    req.query.search = ""
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
    mockProductsFindAndCountAll.mockResolvedValue(mockData)
    
    await getProducts(req, res)

    expect(mockProductsFindAndCountAll).toHaveBeenCalledWith(queryCondition)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(pagingInfo)
  })

  it("should return data when there is no search query and no category", async () => {
    mockProductsFindAndCountAll.mockResolvedValue(mockData)

    await getProducts(req, res)

    expect(mockProductsFindAndCountAll).toHaveBeenCalledWith(queryCondition)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(pagingInfo)
  })

  it("should return message empty data array and empty paging object when data is an empty array", async () => {
    mockProductsFindAndCountAll.mockResolvedValue({...mockData, rows: []})
    await getProducts(req, res)

    expect(mockProductsFindAndCountAll).toHaveBeenCalledWith(queryCondition)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({message: 'No Product Found.', data: [], paging: {}}) 
  })

  it("should return status '500' if an api fails", async () => {
    const error = new Error("Database Error")
    mockProductsFindAndCountAll.mockRejectedValue(error)
    await getProducts(req, res)

    expect(mockProductsFindAndCountAll).toHaveBeenCalledWith(queryCondition)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"message": error}) 
  })

})

describe("getProduct", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        productId: 2
      },
      userId: 1
    }
    res = buildMockResponse()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return product detail", async () => {
    mockProductsFindOne.mockResolvedValueOnce(mockProduct)
    await getProduct(req, res)

    expect(mockProductsFindOne).toHaveBeenCalledWith({
      where: {
        id: req.params.productId
      },
      include: [
        {
          model: cartProducts,
          where: {
            userId: req.userId
          },
          required: false
        }
      ],
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockProduct) 
  })

  it("should return status '404' and error message 'product not found.' ", async () => {
    mockProductsFindOne.mockResolvedValueOnce()
    await getProduct(req, res)

    expect(mockProductsFindOne).toHaveBeenCalledWith({
      where: {
        id: req.params.productId
      },
      include: [
        {
          model: cartProducts,
          where: {
            userId: req.userId
          },
          required: false
        }
      ],
    })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({"message": "product not found."})
  })

  it("should return status '500' if an api fails ", async () => {
    const error = new Error("Database Error")
    mockProductsFindOne.mockRejectedValueOnce(error)
    await getProduct(req, res)

    expect(mockProductsFindOne).toHaveBeenCalledWith({
      where: {
        id: req.params.productId
      },
      include: [
        {
          model: cartProducts,
          where: {
            userId: req.userId
          },
          required: false
        }
      ],
    })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"message": error})
  })
})