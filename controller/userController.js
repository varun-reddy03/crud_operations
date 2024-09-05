const { User } = require('../models');

// Create a new user
async function createUser(request, reply) {
  const { firstName, lastName, email } = request.body;
  //validation is done
  //model--for doing db query
  console.log('///////////////////',request.body); 
  try {
    const user = await User.create({ firstName, lastName, email });
    //presenter step
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}

// Get all users
async function getUsers(request, reply) {
  try {
    const users = await User.findAll();
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
}

// Get a user by ID
async function getUserById(request, reply) {
  try {
    const user = await User.findByPk(request.params.id);                                                                                                    
    if (user) {
      reply.send(user);
    } else {
      reply.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
}

// Update a user
async function updateUser(request, reply) {
  const { firstName, lastName, email } = request.body;
  try {
    const [updated] = await User.update({ firstName, lastName, email }, {
      where: { id: request.params.id }
    });
    if (updated) {
      const user = await User.findByPk(request.params.id);
      reply.send(user);
    } else {
      reply.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
}

// Delete a user
async function deleteUser(request, reply) {
  try {
    const deleted = await User.destroy({
      where: { id: request.params.id }
    });
    if (deleted) {
      reply.send({ message: 'User deleted' });
    } else {
      reply.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
