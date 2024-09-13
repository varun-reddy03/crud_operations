// Valid user data creates a user successfully
const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;
const { app } = require("../index");
const { User } = require("../models");
const UserPresenter = require("../utils/presenter");
const { createUser, updateUser, login,getUsers } = require("../controller/userController");
const { uploadExcelFile } = require("../controller/fileController");
const { parseExcel } = require("../services/excelService");
const excelService = require("../services/excelService");
const UserService = require("../services/userService");
const { userSchema } = require("../utils/userValidator");
const { errorCodes } = require("fastify");

const JWT_SECRET = "varun_reddy";

describe("usercontroller", function () {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a user successfully when valid data is provided", async () => {
    const request = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        password:"123456"
      },
    };
    const reply = {
      send: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    
    const user = {
    id: 1,
      ...request.body,
      createdAt: new Date(),
      updatedAt: new Date()  ,
    };

    
    const userMock = sinon.mock(UserService).expects("createUser").withArgs(request.body).resolves(user);

    
    await createUser(request, reply);

    expect(reply.send.calledOnce).to.be.true;
    expect(reply.send.firstCall.args[0]).to.deep.equal(
      new UserPresenter(user).toJSON()
    );

    userMock.verify();
    
  });

  
  it("should return 500 error when required fields are missing", async () => {
    const request = {
      body: {
        firstName: "",
        lastName: "",
        email: "",
      },
    };
      const userMock = sinon.mock(userSchema).expects('validate').resolves(Error({
        error: "Validation Error",
        details: [
            "\"firstName\" is not allowed to be empty"
        ]
    }))
    const reply = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    await createUser(request, reply);
    expect(reply.status.calledOnceWith(500)).to.be.true;
    expect(reply.send.calledOnce).to.be.true;
    expect(reply.send.firstCall.args[0]).to.have.property("error");
    userMock.verify();
  });




  it('should update user when valid data is provided', async () => {
    const req = {
      params: { id: '123' },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        password: 'password123'
      }
    };
    const reply = {
      send: sinon.stub(),
      status: sinon.stub().returnsThis()
    };
  
    const updatedUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  
    const userServiceMock = sinon.mock(UserService);
    userServiceMock.expects('updateUser')
      .withArgs(req.params.id, req.body)
      .resolves(updatedUser);
  
    await updateUser(req, reply);
  
    expect(reply.send.calledOnce).to.be.true;
    expect(reply.send.firstCall.args[0]).to.deep.equal(new UserPresenter(updatedUser).toJSON());
  
    userServiceMock.verify();
    userServiceMock.restore();
  });


      // Validation passes and user data is correctly sent to UserService
          // Successfully retrieves users and sends response with user data and pagination
      it('should send user data and pagination when UserService.getUsers is successful', async () => {
        const request = { query: {} };
        const reply = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis()
        };
        const mockUsers = [
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', createdAt: new Date(), updatedAt: new Date() },
          { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', createdAt: new Date(), updatedAt: new Date() }
        ];
        const mockPagination = { page: 1, limit: 10, total: 2 };
        sinon.mock(UserService).expects('getUsers').resolves({ data: mockUsers, pagination: mockPagination });

        await getUsers(request, reply);
        
        expect(reply.send.calledOnce).to.be.true;
        expect(reply.send.calledOnceWith({
          data: mockUsers.map(user => new UserPresenter(user).toJSON()),
          pagination: mockPagination,
        })).to.be.true;
      });
    
  });

// describe("password", async function () {
//       // Password shorter than 6 characters triggers validation error
//       it('should trigger validation error when password is shorter than 6 characters', async () => {
//         const req = {
//           body: {
//             firstName: 'John',
//             lastName: 'Doe',
//             email: 'john.doe@example.com',
//             phoneNumber: '1234567890',
//             password: 'pass' // Password shorter than 6 characters
//           }
//         };
//         const reply = {
//           status: sinon.stub().returnsThis(),
//           send: sinon.stub()
//         };

        
//         const userMock = sinon.mock(userSchema).expects("validate").resolves(Error({error: "Validation Error",
//     details: [
//         "\"password\" length must be at least 6 characters long"]
//       }));
    
//         await createUser(req, reply);
    
//         expect(reply.status.calledWith(400)).to.be.true;
//         expect(reply.send.calledOnce).to.be.true;
//         expect(reply.send.firstCall.args[0]).to.deep.equal({
//           error: 'Validation Error',
//           details: ['"password" length must be at least 6 characters long']
//         });
    
//       });
  
// })



