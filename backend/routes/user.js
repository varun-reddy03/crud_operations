

// async function userRoutes(fastify, options) {
//   // Register user (public route)
//   fastify.post('/users', async (request, reply) => {
//     console.log('=================================',request.body);
//     // validation data

//     if(data.validate)
//     {
//       // storing in db

//     }
//     if (request.validationError) {
//       reply.status(400).send({
//         errors: request.validationError.validation.map(error => ({
//           field: error.instancePath.substring(1),
//           message: error.message,
//         })),
//       });
//       return;
//     }

//     await userController.createUser(request, reply);
//   });
  
//   // Login user (public route)
//   fastify.post('/login', {
//     schema: {
//       body: {
//         type: 'object',
//         properties: {
//           email: { type: 'string', format: 'email' },
//           password: { type: 'string' }
//         },
//         required: ['email', 'password']
//       }
//     }
//   }, async (request, reply) => {
//     try {
//       await userController.login(request, reply);
//     } catch (error) {
//       reply.status(401).send({ error: 'Authentication failed.', details: error.message });
//     }
//   });

//   // Apply authentication middleware to routes that require authentication
//   fastify.addHook('preHandler', async (request, reply) => {
//     if (request.routerPath !== '/login' && request.routerPath !== '/users') {
//       // Apply authentication only if it's not a public route
//       await authenticate(request, reply);
//     }
//   });

//   // Get all users (protected route)
//   fastify.get('/users', userController.getUsers);
  
//   // Get user by ID (protected route)
//   fastify.get('/users/:id', userController.getUserById);
  
//   // Update user (protected route)
//   fastify.put('/users/:id', { schema: updateUserSchema, attachValidation: true }, async (request, reply) => {
//     if (request.validationError) {
//       reply.status(400).send({
//         errors: request.validationError.validation.map(error => ({
//           field: error.instancePath.substring(1),
//           message: error.message,
//         })),
//       });
//       return;
//     }

//     await userController.updateUser(request, reply);
//   });

//   // Delete user (protected route)
//   fastify.delete('/users/:id', userController.deleteUser);
// }

// module.exports = userRoutes;
const userController =  require('../controller/userController');
const authenticate = require('../middlewares/authMiddleware');

async function userRoutes(fastify, options) {
  console.log()
  fastify.post('/login',{},userController.login)
  fastify.post('/create',{}, userController.createUser);
  fastify.get('/user/:id',{ preHandler: [authenticate] }, userController.getUserById);
  fastify.put('/user/:id',{ preHandler: [authenticate] },userController.updateUser);
  fastify.delete('/user/:id',{ preHandler: [authenticate] }, userController.deleteUser);
  fastify.get('/users',{ preHandler: [authenticate] }, userController.getUsers);
}

module.exports = userRoutes;
