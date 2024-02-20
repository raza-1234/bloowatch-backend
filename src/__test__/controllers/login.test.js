const { logIn } = require("../../controllers/login")
const { users } = require("../../sequelized/models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { buildMockResponse } = require("../helper")

jest.mock("../../sequelized/models")
jest.mock("jsonwebtoken")
jest.mock('bcrypt')

const mockUsersFindOne = jest.mocked(users.findOne)
const mockJwtSign = jest.mocked(jwt.sign)
const mockBcryptCompare = jest.mocked(bcrypt.compare)

describe("login", () => {
  let response;
  let request;

  beforeEach(() => {
    mockUsersFindOne.mockResolvedValue(mockUserExist)
    mockBcryptCompare.mockResolvedValue(true)

    request = {
      body: {
        email: "test@gmail.com",
        password: "1234"
      }
    }
    
    response = buildMockResponse() 
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  const mockUserExist = {
    id: 1,
    email: "test@gmail.com",
    password: "1234",
    verified: true
  }

  const mockUserNotVerified = {
    id: 1,
    email: "test@gmail.com",
    password: "1234",
    verified: false,
    email_token: "randomToken"
  }

  it("should login user successfully", async () => {
    const accessToken = "abcdefghijklmnopqrstuvwxyz"
    mockJwtSign.mockResolvedValueOnce(accessToken)
    await logIn(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({ "where": {"email": mockUserExist.email}})
    expect(mockJwtSign).toHaveBeenCalledWith(
      {
        "userId": mockUserExist.id
      },
      process.env.ACCESS_SECRET_KEY,
      {expiresIn: "1d"}
    )
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({"message": "Successfully Log In.", accessToken})
  })

  it("should return 'Wrong Password' error if password does not match", async () => {
    mockBcryptCompare.mockResolvedValue(false)
    mockUsersFindOne.mockResolvedValue({})
    await logIn(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(mockUsersFindOne).toHaveBeenCalled()
    expect(response.json).toHaveBeenCalledWith({"message": "Wrong Password"})
  })

  it("should return 'Wrong User Email' error if user not found", async () => {
    mockUsersFindOne.mockResolvedValue()
    await logIn(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Wrong User Email"})
  })

  it("should not logged in user if user is not verfied", async () => {
    mockUsersFindOne.mockResolvedValue(mockUserNotVerified)
    await logIn(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({ "where": {"email": mockUserNotVerified.email}})
    
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "First Verify Your Email.An Email Is Sent To Your Account. Please Verify It."})
  })
})