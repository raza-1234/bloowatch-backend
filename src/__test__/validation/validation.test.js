const {  
  registerUserValidation,
  userAuthorizationValidation,
  verifyEmailValidation
} = require("../../validation/validation")
const { buildMockResponse } = require("../helper")

describe("registerUserValidation", () => {

  const req = {
    body: {
      name: "ahmed",
      email: "ahmed@gmail.com",
      password: "1234"
    }
  }
  const res = buildMockResponse()
  
  it("should return validated data ", () => {
    const data = registerUserValidation(req, res);

    expect(data).toEqual(req.body)
  })

  it("should return statusCode 400 status if anf required field is missing.", () => {
    delete req.body.name;
    registerUserValidation(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({"message": "All Fields Are Compulsory!!!"});
  })
})

describe("userAuthorizationValidation", () => {
  const req = {
    body: {
      email: "ahmed@gmail.com",
      password: "1234"
    }
  }
  const res = buildMockResponse()

  it("should return validated data ", () => {
    const data = userAuthorizationValidation(req);

    expect(data).toEqual(req.body)
  })

  it("should return statusCode 400 status if anf required field is missing.", () => {
    delete req.body.email;
    userAuthorizationValidation(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({"message": "All Fields Are Required"})
  })
})

describe("verifyEmailValidation", () => {
  let req;
  let res;
  
  beforeEach(() => {
    req = {
      body: {
        emailToken: "abcdefgh"
      },
      params: {
        id: "1"
      }
    }
    res = buildMockResponse()
  })

  it("should return validated data ", () => {
    const data = verifyEmailValidation(req);

    expect(data).toEqual({
      id: Number(req.params.id),
      emailToken: req.body.emailToken  
    })
  })

  it("should return 400 statusCode, if id is missing in params", () => {
    delete req.params.id; 
    verifyEmailValidation(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({"message": "Id Is Required In Params."});
  })

  it("should return 400 status and error message 'Token Is Required.' if emailToken not found", () => {
    delete req.body.emailToken;
    verifyEmailValidation(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({"message": "Token Is Required."});
  })
})