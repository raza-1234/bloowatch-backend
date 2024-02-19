const {users} = require("../../sequelized/models")
const { userDetail } = require("../../controllers/userDetail")
const { buildMockResponse } = require("../helper")

jest.mock("../../sequelized/models")

const mockUsersFindOne = jest.mocked(users.findOne)

describe("checkUserById", () => {
  let request;
  let response;

  beforeEach(() => {

    request = {
      params: {
        id: 1
      },
      userId: 1
    }
    response = buildMockResponse()
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  const mockUser = {
    name: "fake name",
    email: "fake@gmail.com",
    id: 1
  }

  it("should return userDetail", async () => {
    mockUsersFindOne.mockResolvedValueOnce(mockUser)
    await userDetail(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"id": request.userId}})
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(mockUser)
  })

  it("should return status '400' and if user not exist", async () => {
    mockUsersFindOne.mockResolvedValueOnce()
    await userDetail(request, response)

    expect(mockUsersFindOne).toHaveBeenCalledWith({"where": {"id": request.userId}})
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({"message": "User Not Exist."})
  })

  it("should return status '403' and error 'Access denied.' if user nis not authenticated", async () => {
    request.params.id = 2
    await userDetail(request, response) 

    expect(response.status).toHaveBeenCalledWith(403)
    expect(response.json).toHaveBeenCalledWith({"message": "Access denied."})
    expect(mockUsersFindOne).not.toHaveBeenCalledWith()
  })

  it("should return status '500' if an api fails ", async () => {
    const error = new Error('Database error')
    mockUsersFindOne.mockRejectedValueOnce(error)
    await userDetail(request, response) 

    expect(response.status).toHaveBeenCalledWith(500)
    expect(mockUsersFindOne).toHaveBeenCalled()
  })
})