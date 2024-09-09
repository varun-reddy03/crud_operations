// controllers/userController.js
const { User } = require('../models');
const { Op } = require('sequelize');
const UserPresenter = require('../utils/presenter');

// Create a new user
async function createUser(request, reply) {
  const { firstName, lastName, email } = request.body;

  try {
    // Create a new user in the database
    const user = await User.create({ firstName, lastName, email });

    // Use presenter to format the response
    reply.send(new UserPresenter(user).toJSON());
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create user.', details: error.message });
  }
}

// controllers/userController.js

async function getUsers(request, reply) {
  console.log('Raw request object:==================================', request);
  console.log('Query parameters:------------------------------------------', request.query);
  

  // Extract query parameters with default values
  let { page = 1, limit = 10, search = '', filter = '', sort = 'id', order = 'ASC', minId, maxId } = request.query;

  // Convert page and limit to integers
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Initialize minIdInt and maxIdInt as null
  let minIdInt = null;
  let maxIdInt = null;

  // Convert minId and maxId to integers if they are provided and are valid numbers
  if (minId && !isNaN(minId.trim())) {
    minIdInt = parseInt(minId, 10);
  }

  if (maxId && !isNaN(maxId.trim())) {
    maxIdInt = parseInt(maxId, 10);
  }

  // Debugging: Log parsed minIdInt and maxIdInt
  console.log('Parsed minIdInt and maxIdInt:', { minIdInt, maxIdInt });

  // Construct the where clause for filtering
  const whereClause = {
    [Op.and]: [
      { firstName: { [Op.iLike]: `%${search}%` } }, // Search logic
      { email: { [Op.iLike]: `%${filter}%` } }, // Filter logic
      ...(minIdInt !== null || maxIdInt !== null
        ? [{ id: { [Op.between]: [minIdInt || 0, maxIdInt || Number.MAX_SAFE_INTEGER] } }]
        : []), // ID range filter logic
    ],
  };
  
  try {
    // Fetch users from the database with pagination, filtering, and sorting
    const users = await User.findAll({
      where: whereClause,
      order: [[sort, order]], // Sorting logic
      limit, // Pagination limit
      offset, // Pagination offset
    });

    // Count total users for pagination
    const totalUsers = await User.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalUsers / limit);

    // Use presenter to format each user in the response
    reply.send({
      data: users.map(user => new UserPresenter(user).toJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalUsers,
      },
    });
  } catch (error) {
    // Debugging: Log the error
    console.error('Error retrieving users:', error);

    reply.status(500).send({ error: 'Failed to retrieve users.', details: error.message });
  }
}



// Get a user by ID
async function getUserById(request, reply) {
  try {
    const user = await User.findByPk(request.params.id);
    if (user) {
      reply.send(new UserPresenter(user).toJSON());
    } else {
      reply.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Failed to retrieve user.', details: error.message });
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
      reply.send(new UserPresenter(user).toJSON());
    } else {
      reply.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update user.', details: error.message });
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
    reply.status(500).send({ error: 'Failed to delete user.', details: error.message });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
