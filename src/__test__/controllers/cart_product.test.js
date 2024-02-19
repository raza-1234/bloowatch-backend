const { users, products, cartProducts } = require("../../sequelized/models")
const {
  addToCart, 
  getCartProducts,
  removeFromCart,
  updateCart
} = require("../../controllers/cart_product")
const { buildMockResponse, mockProduct, mockCartProduct } = require('../helper');

jest.mock("../../sequelized/models")

const mockProductsFindOne = jest.mocked(products.findOne)
const mockCartProductsCreate = jest.mocked(cartProducts.create)
const mockCartProductsFindOne = jest.mocked(cartProducts.findOne)
const mockCartProductsFindAll = jest.mocked(cartProducts.findAll)
const mockUsersFindOne = jest.mocked(users.findOne)

const buildMockRequest = () => {
  let request = {
    body: {
      productId: 1,
      quantity: 3,
    },
    params: {
      id: 1
    },
    userId: 1
  }
  return request
};

describe("addToCart", () => {
  let response;
  let request;

  beforeEach(() => {
    request = buildMockRequest();
    response = buildMockResponse();
  })

  afterEach(()  => {
    jest.clearAllMocks()
  })

  it("should return status '403' and error message 'Access denied if user is not authenticated.'", async () => {
    request.params.id = 2;

    await addToCart(request, response)

    expect(response.status).toHaveBeenCalledWith(403)
    expect(response.json).toHaveBeenCalledWith({"message": "Access denied."})
  })

  it("should return statusCode 400, if product id not found", async () => {
    delete request.body.productId;

    await addToCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Product Id not found."})
  })

  it("should return status code '400' if required product not found.", async () => {
    mockProductsFindOne.mockResolvedValue(); 

    await addToCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400) 
    expect(response.json).toHaveBeenCalledWith({"message": "Required product not found."});
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}});
  })

  it("should return error message if product quantity is less than the user added cart qunatity.", async () => {
    mockProductsFindOne.mockResolvedValue(mockProduct);
    mockCartProductsFindOne.mockResolvedValue(mockCartProduct)

    await addToCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({"message": "Product is out of stock."});
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith({
      "where": {"productId": request.body.productId, "userId": request.params.id}
    })
  })

  it("should add product in cart.", async () => {
    mockProductsFindOne.mockResolvedValueOnce(mockProduct)
    mockCartProductsFindOne.mockResolvedValueOnce(); 

    await addToCart(request, response)

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({"message":`Product added in cart.`}); 

    expect(mockCartProductsCreate).toHaveBeenCalledWith(mockCartProduct)
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith({
      "where": {"productId": request.body.productId, "userId": request.params.id}
    })
  })

   it("should return status '500' if an api fails ", async () => {
    const error = new Error("Database Error") 
    mockProductsFindOne.mockRejectedValue(error)

    await addToCart(request, response)
    
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({"errorMessage": error});

    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
  })
  
  it("should return statusCode 400 if product quantity is less then user cart quanity", async () => {
    request.body.quantity = 6;
    mockProductsFindOne.mockResolvedValueOnce(mockProduct);
    mockCartProductsFindOne.mockResolvedValueOnce()

    await addToCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({"message": "Product is out of stock."});
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith({
      "where": {"productId": request.body.productId, "userId": request.params.id}
    })
  })

  it("should update cart quantity if it already exist in cart and product quantity is greater than the user added cart qunatity", async () => {
    request.body.quantity = 1;
    mockCartProduct.save = jest.fn()
    mockProductsFindOne.mockResolvedValueOnce(mockProduct);
    mockCartProductsFindOne.mockResolvedValueOnce(mockCartProduct)

    await addToCart(request, response)
 
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({"message": "Product added in cart."});
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith({ 
      "where": {"productId": request.body.productId, "userId": request.params.id}
    })
  })

})

describe("updateCart", () => {
  let response;
  let request;

  beforeEach(() => {
    request = buildMockRequest();
    response = buildMockResponse();

    mockCartProduct.save = jest.fn();

    mockProductsFindOne.mockResolvedValue(mockProduct)
    mockCartProductsFindOne.mockResolvedValue(mockCartProduct)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return status '403' if user is not authenticated.", async () => {
    request.params.id = 2
    await updateCart(request, response)

    expect(response.status).toHaveBeenCalledWith(403)
    expect(response.json).toHaveBeenCalledWith({"message": "Access denied."})
  })

  it("should return statusCode 400, if product id not found", async () => {
    delete request.body.productId;

    await updateCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Product Id not found."})
  })

  it("should return status '400' and error message 'Required product not found.'", async () => {
    mockProductsFindOne.mockResolvedValue()

    await updateCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Required product not found."})
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
  })

  it("should update product quantity in cart if product quantity is euqal or greater then user cart quantity", async () => { //
    await updateCart(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({"message": "Product added in cart."})
    expect(mockCartProduct.save).toHaveBeenCalled()
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith({
      "where": {"productId": request.body.productId, "userId": request.params.id}
    })
  })

  it("should return status '400' if product quantity is less then user cart quantity", async () => {
    request.body.quantity = 6

    await updateCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Product is out of stock."})
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith({
      "where": {"productId": request.body.productId, "userId": request.params.id}
    })
  })

  it("should return status '500' if an api fails ", async () => {
    const error = new Error("Database Error")
    mockProductsFindOne.mockRejectedValue(error)
    await updateCart(request, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({"errorMessage": error })
    expect(mockProductsFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
  })

})

describe("removeFromCart", () => {
  let response;
  let request;

  beforeEach(() => {
    request = buildMockRequest();
    response = buildMockResponse();

    mockCartProductsFindOne.mockResolvedValue(mockCartProduct)

    mockCartProduct.destroy = jest.fn();
  })

  afterEach(() => {
    jest.clearAllMocks()
  })


  it("should return status '403' if user is not authenticated.", async () => {
    request.params.id = 2
    await removeFromCart(request, response)

    expect(response.status).toHaveBeenCalledWith(403)
    expect(response.json).toHaveBeenCalledWith({"message": "Access denied."})
  })

  it("should return statusCode 400, if product id not found", async () => {
    delete request.params.productId;

    await removeFromCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Required parameters should be proper number type."})
  })

  it("should return status '400' if Product not found", async () => { 
    request.params.productId = 1; 

    mockCartProductsFindOne.mockResolvedValue()

    await removeFromCart(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Product already not exist in cart."})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith(
      {"where": {"productId": request.params.productId, "userId": request.params.id}}
    ) 
  })

  it("should delete cartItem ", async () => {
    request.params.productId = 1;

    await removeFromCart(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({"message": "Item removed from cart"})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith(
      {"where": {"productId": request.params.productId, "userId": request.params.id}}
    )
  })

  it("should return status '500' if an api fails ", async () => {
    request.params = {
      id: 1,
      productId: 1,
    }
    const error = new Error("Database Error")
    mockCartProductsFindOne.mockRejectedValue(error)

    await removeFromCart(request, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({"errorMessage": error})
    expect(mockCartProductsFindOne).toHaveBeenCalledWith(
      {"where": {"productId": request.params.productId, "userId": request.params.id}}
    )
  })
})  

describe("getCartProducts", () => {
  let response;
  let request;

  beforeEach(() => {
    request = buildMockRequest();
    response = buildMockResponse();

    mockUsersFindOne.mockResolvedValue(mockUser)
    mockCartProductsFindAll.mockResolvedValue([mockCartProduct])

    mockCartProduct.save = jest.fn();
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockUser = {
    name: "fake user",
    email: "fake@gmail.com",
    id: 1
  }

  it("should return status '403' if user is not authenticated.", async () => { 
    request.params.id = 2
    await getCartProducts(request, response)

    expect(response.status).toHaveBeenCalledWith(403)
    expect(response.json).toHaveBeenCalledWith({"message": "Access denied."})
  })

  it("should return status '400' if user not found", async () => {
    mockUsersFindOne.mockResolvedValue()
    await getCartProducts(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "userId 1 does not exist."})
    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
  })

  it("should return cart Items", async () => {
    await getCartProducts(request, response)

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([mockCartProduct]) ;
    expect(mockCartProductsFindAll).toHaveBeenCalledWith(
      {"include": [products], "order": [["id", "ASC"]], "where": {"userId": request.params.id}}
    )
    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
  })

  it("should return message if no cart item found.", async () => {
    mockCartProductsFindAll.mockResolvedValue([])
    await getCartProducts(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({"message": "No data exists in the cart for the required user."})
    expect(mockCartProductsFindAll).toHaveBeenCalledWith({"include": [products], "order": [["id", "ASC"]], "where": {"userId": 1}})
    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"id": request.params.id}})
  })

  it("should return status '500' if an api fails ", async () => {
    const error = new Error("Database Error")
    mockCartProductsFindAll.mockRejectedValue(error)

    await getCartProducts(request, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({"message": error})
    expect(mockCartProductsFindAll).toHaveBeenCalledWith({
      "include": [products], "order": [["id", "ASC"]], "where": {"userId": request.params.id}
    })
  }) 
})