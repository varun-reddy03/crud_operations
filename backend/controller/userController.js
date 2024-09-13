const bcrypt = require("bcrypt");
const UserService = require("../services/userService"); // Update path as needed
const UserPresenter = require("../utils/presenter");
const { userSchema, updateUserSchema } = require("../utils/userValidator");

const jwt = require("jsonwebtoken");

const JWT_SECRET = "varun_reddy";

// Login user
const login = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getUserByEmail(email); // Make sure this method exists

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    reply.send({ token });
  } catch (error) {
    reply.status(500).send({ error: "Login failed.", details: error.message });
  }
};

// Create a new user
const createUser = async (req, reply) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Step 1: Validate incoming data using the userSchema
    const { error } = userSchema.validate({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    console.log("----------:"+error);
    // Step 2: If validation fails, send a 400 error response with validation details
    if (error) {
      return reply.status(400).send({
        error: "Validation Error",
        details: error.details.map((detail) => detail.message),
      });
    }

    // Step 3: If validation passes, proceed to create the user in the UserService
    const user = await UserService.createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    // Step 4: Send the newly created user as a response
    reply.send(new UserPresenter(user).toJSON());
  } catch (error) {
    // Step 5: Handle errors and send a 500 error response
    reply
      .status(500)
      .send({ error: "Failed to create user.", details: error.message });
  }
};

// Get all users with pagination, search, filter, and sorting
const getUsers = async (request, reply) => {
  try {
    const result = await UserService.getUsers(request.query);
    reply.send({
      data: result.data.map((user) => new UserPresenter(user).toJSON()),
      pagination: result.pagination,
    });
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to retrieve users.", details: error.message });
  }
};

// Get a user by ID
const getUserById = async (request, reply) => {
  try {
    const user = await UserService.getUserById(request.params.id);
    if (user) {
      reply.send(new UserPresenter(user).toJSON());
    } else {
      reply.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to retrieve user.", details: error.message });
  }
};

// Update a user
const updateUser = async (req, reply) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Validate the request body using the updateUserSchema
    const { error, value } = updateUserSchema.validate({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    // If validation fails, send a 400 error response with validation details
    if (error) {
      return reply.status(400).send({
        error: "Validation Error",
        details: error.details.map((detail) => detail.message),
      });
    }

    // Proceed with updating the user if validation passes
    const updatedUser = await UserService.updateUser(id, value);

    if (updatedUser) {
      reply.send(new UserPresenter(updatedUser).toJSON());
    } else {
      reply.status(404).send({ error: "User not found." });
    }
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to update user.", details: error.message });
  }
};

// Delete a user
const deleteUser = async (request, reply) => {
  try {
    const deleted = await UserService.deleteUser(request.params.id);
    if (deleted) {
      reply.send({ message: "User deleted" });
    } else {
      reply.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to delete user.", details: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
