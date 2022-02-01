const fs = require('fs').promises;

module.exports = async (pool) => {
  const filenames = await fs.readdir(`${__dirname}/../sql`);
  const queries = await Promise.all(filenames.map(filename => fs.readFile(`${__dirname}/../sql/${filename}`, { encoding: 'utf-8' })));
  try {
    for(let i = 0; i < filenames.length; i++) {
      console.log('Running SQL file: ' + filenames[i]);
      await pool.query(queries[i]);
    }
    console.log('✅ Database setup complete!');
  } catch(error) {
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
  }
};
