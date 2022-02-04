const fs = require('fs');
const path = require('path');

module.exports.seedDatabase = async () => {
  const seedsDirectory = path.join(__dirname, '../prisma/seeds');
  const files = fs.readdirSync(seedsDirectory);
  return Promise.all(files.map((file) => {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const seed = require(path.join(seedsDirectory, file));
    console.log('seeding', path.basename(file, '.js'));
    return seed();
  }));
};
