// models/User.js
'use strict';
const { Model, DataTypes, Op } = require('sequelize');
const userSchema = require('./schema/userSchema'); // Import the schema

module.exports = (sequelize) => {
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
    timestamps: true,
  });

  return User;
};
