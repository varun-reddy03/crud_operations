// models/schemas/userSchema.js
const { DataTypes } = require('sequelize');

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
  },
  phoneNumber: { 
    type: DataTypes.STRING,
    allowNull: true, 
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: false, 
  },
};

module.exports = userSchema;
