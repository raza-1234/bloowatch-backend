const { editUser } = require("../../controllers/editUser")
const { users } = require("../../sequelized/models")
const bcrypt = require("bcrypt")
const { buildMockResponse } = require("../helper")

jest.mock("../../sequelized/models")
jest.mock("bcrypt")

const mockUsersFindOne = jest.mocked(users.findOne)
const mockBcryptCompare = jest.mocked(bcrypt.compare)
const mockBcryptHash = jest.mocked(bcrypt.hash)

describe("editUser", () => {
  let response;
  let request;

  beforeEach(() => {
    mockUsersFindOne.mockResolvedValue(mockUser)
    mockBcryptCompare.mockResolvedValue(true)

    request = {
      body: {
        name: "fake name",
        currentPassword: "1234",
        newPassword: "12345",
        email: "fake@gmail.com"
      }
    } 
    response = buildMockResponse()
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  const mockUser = {
    name: "ahmed",
    email: "ahmed@gmil.com",
    password: "encryptedPassword",
    verified: true,
    update: jest.fn()
  }

  it("should update user name only", async () => {
    request.body.newPassword = ""
    await editUser(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"email": request.body.email}})
    expect(mockBcryptCompare).toHaveBeenCalled()
    expect(mockUser.update).toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({"message": "Changes Saved."})
  })

  it("should update user name and password", async () => {
    mockBcryptHash("hashedPassword")
    await editUser(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"email": request.body.email}})
    expect(mockUser.update).toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({"message": "Changes Saved."})
  })

  it("should return status '400' and error 'Wrong Password' ", async () => {
    mockBcryptCompare.mockResolvedValue(false)
    await editUser(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"email": request.body.email}})
    expect(mockBcryptCompare).toHaveBeenCalled()
    expect(mockUser.update).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "Wrong Password."})
  })

  it("should return status '404' and error 'user does not exist' ", async () => {
    mockUsersFindOne.mockResolvedValue()
    await editUser(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"email": request.body.email}})
    expect(mockUser.update).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({"message": "user does not exist"})
  })
})