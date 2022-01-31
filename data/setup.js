const fs = require('fs').promises;

module.exports = (pool) => {
  return fs.readdir(`${__dirname}/../sql`)
    .then(files => Promise.all(files.map(file => fs.readFile(`${__dirname}/../sql/${file}`, { encoding: 'utf-8' }))))
    .then(queries => Promise.all(queries.map(query => pool.query(query))))
    .then(() => console.log('✅ Database setup complete!'))
    .catch((error) => {
      const dbNotFound = error.message.match(/database "(.+)" does not exist/i);

      if (dbNotFound) {
        const [err, db] = dbNotFound;
        console.error('❌ Error: ' + err);
        console.info(
          `Try running \`createdb -U postgres ${db}\` in your terminal`
        );
      } else {
        console.error(error);
        console.error('❌ Error: ' + error.message);
      }
    });
};
