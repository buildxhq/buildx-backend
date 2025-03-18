const knexLib = require('knex');
require('dotenv').config();

const knex = knexLib({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
    },
    pool: { min: 2, max: 10 },
});

knex.raw('SELECT 1')
    .then(() => console.log('✅ PostgreSQL Connected'))
    .catch((err) => {
        console.error('❌ PostgreSQL Connection Error:', err);
        process.exit(1);
    });

module.exports = knex;
