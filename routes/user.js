const userController = require('../controller/userController');

async function userRoutes(fastify, options) {
  fastify.post('/users', userController.createUser);
  fastify.get('/users', userController.getUsers);
  fastify.get('/users/:id', userController.getUserById);
  fastify.put('/users/:id', userController.updateUser);
  fastify.delete('/users/:id', userController.deleteUser);
}

module.exports = userRoutes;
