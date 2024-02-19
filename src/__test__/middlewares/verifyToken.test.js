const jwt = require("jsonwebtoken")
const { verifyToken } = require("../../middlewares/verifyToken")

jest.mock("jsonwebtoken");
const mockJwtVerify = jest.mocked(jwt.verify);

describe("verifyToken", () => {
  let res;
  let req;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    let request;
    let response;

    mockResponse = () =>  {
      response = {}; 
      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();
      return response;
    }

    mockRequest = (bearerToken) => {
      request = {};
      request.headers = {
        authorization: bearerToken
      } 
      return request;
    }

    req = mockRequest("bearer fakeToken")
    res = mockResponse()

    mockJwtVerify.mockImplementation((token, secretKey, callback) => {
      callback(null, mockDecodedToken) 
    })
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  const mockNext = jest.fn()
  const mockDecodedToken = {
    userId:  "1"
  }

  it("should verify token, append decodedToken userId intop request and call next()", () => {
    verifyToken(req, res, mockNext)

    expect(res.status).not.toHaveBeenCalled()
    expect(req.userId).toBe(mockDecodedToken.userId)
    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })

  it("should return error 'token expire' and status code '403' ", async () => {
    mockJwtVerify.mockImplementation((token, secretKey, callback) => {
      callback(new Error("token expired")) 
    })
    
    verifyToken(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({"message": "token expire"})
    expect(mockNext).not.toHaveBeenCalled()
  })

  it("should return status '401' and error message 'You are not logged in.' if there is no token", () => {
    req = mockRequest() 
 
    verifyToken(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({"message": "You are not logged in."})
  })

})
