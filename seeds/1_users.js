const User = require('../models/user').User,
log = require('../libs/logger')(module),
users = require('./dev/users')

exports.seed = function(knex, Promise) {
  log.info('Creating users...');

  let userPromises = [];
  users.forEach((user) => {
    userPromises.push(createUser(user));
  });

  return Promise.all(userPromises)
  .catch((error) => {
    log.error('Spark encountered an error while seeding users:');
    log.error(error);
  });
};

/**
* Generate hash for given password and store user
*/
const createUser = (user) => {
  let newUser = new User(user);
  newUser.generateHash(user.password);
  return newUser.save();
};
