const { registerUser } = require('../../controllers/register');
const { users } = require('../../sequelized/models');
const { sendEmail } = require('../../utils/sendEmail');
const bcrypt = require('bcrypt');
const crypto = require("crypto")
const { buildMockResponse } = require("../helper")

jest.mock('../../sequelized/models', () => ({
  users: {
    create: jest.fn(),
    findOne: jest.fn(),
    finsAll: jest.fn()
  },
}));
jest.mock('../../utils/sendEmail');
jest.mock('bcrypt');
jest.mock('crypto')

const mockusersFindOne = jest.mocked(users.findOne)
const mockusersCreate = jest.mocked(users.create)
const mockSendEmail = jest.mocked(sendEmail) 
const mockBcryptHash = jest.mocked(bcrypt.hash)
const mockBcryptCrypto = jest.mocked(crypto.randomBytes.mockReturnValue({ toString: () => 'randomToken' }))

describe('registerUser', () => {
  let response;
  let request;

  beforeEach(() => {
    request = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: '1234',
      }
    }
    response = buildMockResponse();
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
  }

  it('should successfully register a new user', async () => {
    const url = `http://localhost:3000/verify_email/${mockUser.id}`
    mockusersFindOne.mockResolvedValueOnce()
    mockusersCreate.mockResolvedValueOnce(mockUser);
    mockBcryptHash.mockResolvedValueOnce('hashedPassword');

    await registerUser(request, response);

    expect(mockusersCreate).toHaveBeenCalledWith({
      name: request.body.name,
      email: request.body.email,
      password: 'hashedPassword',
      email_token: 'randomToken',
    });

    expect(mockSendEmail).toHaveBeenCalledWith(
      request.body.email,
      'Verify Email By Entering The Provided-Token Code In Website',
      url,
      'randomToken'
    );

    expect(mockBcryptCrypto).toHaveBeenCalledTimes(1)
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'An Email Is Sent To Your Account. Please Verify Your Email.' });
  });

  it('should return "400" if email is already registered', async () => {
    mockusersFindOne.mockResolvedValueOnce(mockUser);

    await registerUser(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ "message": 'Entered Email Is Already Registered.' });
    expect(mockBcryptCrypto).not.toHaveBeenCalled()
  });
 
  it('should return status 500 if api fails', async () => {
    const error = new Error('Database error')
    mockusersCreate.mockRejectedValue(error);

    await registerUser(request, response)

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({"message": error}); 
    expect(mockusersCreate).toHaveBeenCalled()
    expect(mockusersFindOne).toHaveBeenCalled()
  }); 
});
 