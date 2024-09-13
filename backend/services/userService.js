const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Op } = require('sequelize');
const { userSchema, updateUserSchema } = require('../utils/userValidator');

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};


const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new Error('Error retrieving user by email: ' + error.message);
  }
};



const createUser = async (userData) => {
  try {
    // Step 1: Hash the password for authentication (if provided)
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    // Step 2: Create the user in the database
    const user = await User.create(userData);

    // Step 3: Return the created user
    return user;
  } catch (error) {
    // Handle errors and throw an appropriate error message
    throw new Error('Error creating user: ' + error.message);
  }
};

const getUsers = async (query) => {
  let { page = 1, limit = 10, search = '', filter = '', sort = 'id', order = 'ASC', minId, maxId } = query;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const offset = (page - 1) * limit;

  const minIdInt = minId ? parseInt(minId, 10) : null;
  const maxIdInt = maxId ? parseInt(maxId, 10) : null;

  const whereClause = {
    [Op.and]: [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${filter}%` } },
      ...(minIdInt !== null || maxIdInt !== null ? [
        { id: { [Op.between]: [minIdInt || 0, maxIdInt || Number.MAX_SAFE_INTEGER] } }
      ] : [])
    ]
  };

  try {
    const users = await User.findAll({
      where: whereClause,
      order: [[sort, order]],
      limit,
      offset,
    });

    const totalUsers = await User.count({ where: whereClause });
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalUsers,
      },
    };
  } catch (error) {
    throw new Error('Error retrieving users: ' + error.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error('Error retrieving user: ' + error.message);
  }
};

const updateUser = async (id, userData) => {
  try {
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }
    const [updated] = await User.update(userData, { where: { id } });
    if (updated) {
      return await User.findByPk(id);
    }
    return null;
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const deleted = await User.destroy({ where: { id } });
    return deleted;
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
