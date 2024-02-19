const {
  checkUserById, 
  checkUserByEmail
} = require("../../utils/checkUser");
const { users } = require("../../sequelized/models");

jest.mock("../../sequelized/models")

const mockUsersFindOne = jest.mocked(users.findOne)

const mockUserData = {
  id: 1, 
  email: 'test1@example.com', 
  name: 'Test User 1'
}

describe('checkUserById', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return false if user does not exist', async () => {
    mockUsersFindOne.mockResolvedValueOnce()
    const result = await checkUserById(mockUserData.id);
    
    expect(result).toBeFalsy();
    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { id: mockUserData.id } });
  });

  it('should return user if user exist', async () => {
    mockUsersFindOne.mockResolvedValueOnce(mockUserData)
    const result = await checkUserById(1);
    
    expect(result).toEqual(mockUserData);
    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { id: mockUserData.id } });
  });

  it('should return error if an api fails', async () => {
    const error = new Error("Database Error")
    mockUsersFindOne.mockRejectedValueOnce(error)

    await expect(checkUserById(mockUserData.id)).rejects.toThrowError(`${error}`);
    
    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { id: mockUserData.id } }); 
  });
});

describe('checkUserByEmail', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return false if user email does not exist', async () => {
    mockUsersFindOne.mockResolvedValueOnce()

    const result = await checkUserByEmail(mockUserData.email);
    
    expect(result).toBeFalsy();
    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
  });

  it('should return user if user email exist', async () => {
    mockUsersFindOne.mockResolvedValueOnce(mockUserData)

    const result = await checkUserByEmail("test1@example.com");
    
    expect(result).toEqual(mockUserData);
    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
  });

  it('should return error if an api fails', async () => {
    const error = new Error("Database Error")
    mockUsersFindOne.mockRejectedValueOnce(error)

    await expect(checkUserByEmail(mockUserData.email)).rejects.toThrowError(`${error}`);
    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { email: mockUserData.email }}); 
  });
});
