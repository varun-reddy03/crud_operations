
const fastify = require('fastify')({ logger: true });


const userRoutes = require('./routes/user');
const models = require('./models'); 


fastify.register(userRoutes);


models.sequelize.sync().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});


fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
