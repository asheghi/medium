const bcrypt = require('bcryptjs');

module.exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

module.exports.comparePassword = (hash, password) => bcrypt.compareSync(password, hash);
