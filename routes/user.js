// routes/userRoutes.js
const userController = require('../controller/userController');
const { userSchema } = require('../utils/userValidator');

async function userRoutes(fastify, options) {
  fastify.post('/users', { schema: userSchema, attachValidation: true }, async (request, reply) => {
    if (request.validationError) {
      reply.status(400).send({
        errors: request.validationError.validation.map(error => ({
          field: error.instancePath.substring(1),
          message: error.message,
        })),
      });
      return;
    }

    await userController.createUser(request, reply);
  });
  
  fastify.get('/users', userController.getUsers);
  fastify.get('/users/:id', userController.getUserById);
  fastify.put('/users/:id', { schema: userSchema, attachValidation: true }, async (request, reply) => {
    if (request.validationError) {
      reply.status(400).send({
        errors: request.validationError.validation.map(error => ({
          field: error.instancePath.substring(1),
          message: error.message,
        })),
      });
      return;
    }

    await userController.updateUser(request, reply);
  });

  fastify.delete('/users/:id', userController.deleteUser);
}

module.exports = userRoutes;
