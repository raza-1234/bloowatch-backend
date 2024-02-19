const { coupons } = require("../../sequelized/models")
const {
  createCoupons,
  checkCoupons
} = require("../../controllers/coupon")
const { buildMockResponse } = require("../helper")

jest.mock("../../sequelized/models")

const mockCouponsFindOne = jest.mocked(coupons.findOne)
const mockCouponsCreate = jest.mocked(coupons.create)

describe("coupons", () => {
  let req;
  let res;

  const mockCoupon = {
    name: "fake coupon",
    discountPercentage: "10%"
  }

  beforeEach(() => {
    req = {
      body: {...mockCoupon}
    }

    res = buildMockResponse();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("should return status '400' and error message 'Required Fields Are Not Found.' ", async () => {
    req.body.name = "";
    await createCoupons(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({"message": "Required Fields Are Not Found."})
  })

  it("should create new coupon", async () => {
    await createCoupons(req, res)

    expect(mockCouponsCreate).toHaveBeenCalledWith(mockCoupon)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({"message": `Coupon ${mockCoupon.name} is successfully added.`})
  })

  it("should return error if api fails ", async () => {
    const error = new Error("Database Error")
    mockCouponsCreate.mockRejectedValue(error)

    await createCoupons(req, res)

    expect(mockCouponsCreate).toHaveBeenCalledWith(mockCoupon)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"message": error})
  })
})

describe("checkCoupons", () => {
  let req;
  let res;

  beforeEach(() => {
    mockCouponsFindOne.mockResolvedValue(mockCouponDetail)

    req = {
      params: {
        name: "fake coupon",
      }
    }
    res = buildMockResponse();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  const mockCouponDetail = {
    name: "fake coupon",
    discountPercentage: "10%"
  }

  it("should return status '400' if coupon name or discountPercentage field not found", async () => {
    req.params.name = ""
    await checkCoupons(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({"message": "Required parameter is not found."})
  })

  it("should return coupon detail", async () => {
    await checkCoupons(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockCouponDetail)
    expect(mockCouponsFindOne).toHaveBeenCalledWith({"where": {"name": mockCouponDetail.name}})
  })

  it("should return status '400' when coupon not found", async () => {
    mockCouponsFindOne.mockResolvedValue()
    
    await checkCoupons(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({"message": "Invalid coupon."})
  })

  it("should return status '500' if an apis fails", async () => {
    const error = new Error("Database Error")
    mockCouponsFindOne.mockRejectedValue(error)
    await checkCoupons(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"message": error})
    expect(mockCouponsFindOne).toHaveBeenCalled()
  })
})