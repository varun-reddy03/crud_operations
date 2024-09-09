const fastify = require('fastify')({ logger: true });
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/user');
const models = require('./models');
const multer = require('fastify-multer');
// const FastifyMultipart = require('@fastify/multipart'); // Use @fastify/multipart

// // Register plugins and routes
// fastify.register(FastifyMultipart, {
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB
//   },
// });
console.log('BEFORE REGISTER');

fastify.register(multer.contentParser);
fastify.register(userRoutes);
fastify.register(fileRoutes);

// Sync database models
models.sequelize.sync().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// Start server
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on http://localhost:3000`);
});
