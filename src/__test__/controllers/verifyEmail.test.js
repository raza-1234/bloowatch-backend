const { verifyEmail } = require('../../controllers/verifyEmail');
const { users } = require('../../sequelized/models');
const { buildMockResponse } = require("../helper")

jest.mock('../../sequelized/models');

const mockUsersFindOne = jest.mocked(users.findOne)

describe('verifyEmail', () => {
  let response;
  let request;

  beforeEach(() => {
    mockUsersFindOne.mockResolvedValue(mockUserExist);

    request = {
      body: {
        id: 1,
        emailToken: 'validToken'
      },
      params: {
        id: 1
      }
    }
    response = buildMockResponse();
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUserExist = {
    id: 1, 
    email_token: 'validToken', 
    save: jest.fn()
  }

  it('should successfully verify email with correct user ID and email token', async () => {
    await verifyEmail(request, response);

    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { id: request.body.id } }); 
    expect(mockUserExist.verified).toBeTruthy();
    expect(mockUserExist.email_token).toBe('');
    expect(mockUserExist.save).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ message: 'Email Verified Successfully.' });
  });

  it('should return status "404" if user not found', async () => {
    mockUsersFindOne.mockResolvedValue();

    await verifyEmail(request, response);

    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { id: request.body.id } });
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ "message": 'User Not Exist.'});
  });

  it('should return status "403" if user token does not match', async () => {
    mockUserExist.email_token = "userToken"

    await verifyEmail(request, response);

    expect(mockUsersFindOne).toHaveBeenCalledWith({ where: { id: request.body.id } });
    expect(mockUserExist.email_token).not.toBe(request.body.emailToken)
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({ "message": 'Invalid Link' });
  });

});
