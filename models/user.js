'use strict';
const { Model, DataTypes, Op } = require('sequelize');

module.exports = (sequelize) => {
  const userSchema = {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    }
  };

  class User extends Model {

    static async getAllUsers(data = {}) {
      try {
        const { currentUser, id } = data;
        const users = await User.findAll({
          where: {
            [Op.not]: [
              { id: { [Op.eq]: id } },
              { firstName: { [Op.eq]: currentUser } }
            ]
          },
          order: [['firstName', 'ASC']]
        });
        return users;
      } catch (error) {
        throw error;
      }
    }

    static async getUsersExcludingCurrentUser(data = {}) {
      try {
        const { currentUser, id } = data;
        const users = await User.findAll({
          where: {
            [Op.not]: [
              { id: { [Op.eq]: id } },
              { firstName: { [Op.eq]: currentUser } }
            ]
          }
        });
        return users;
      } catch (error) {
        throw error;
      }
    }

    static async createUser(data = {}) {
      try {
        const user = await User.create(data);
        return user;
      } catch (error) {
        throw error;
      }
    }

    static async findUserByEmail(email) {
      try {
        const user = await User.findOne({ where: { email } });
        return user;
      } catch (error) {
        throw error;
      }
    }

    static async updateUserData(payload = {}, userId) {
      try {
        const [updated] = await User.update(payload, {
          where: { id: userId }
        });
        if (updated) {
          return await User.findByPk(userId);
        }
        return null;
      } catch (error) {
        throw error;
      }
    }

    static async deleteUserById(id) {
      try {
        const deleted = await User.destroy({ where: { id } });
        return deleted;
      } catch (error) {
        throw error;
      }
    }
  }

  User.init(userSchema, {
    sequelize,
    tableName: 'Users',
    modelName: 'User',
    timestamps: true ,
  });

  return User;
};
