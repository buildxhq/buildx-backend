const knexLib = require('knex');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// Ensure password is a valid string
if (!connectionString || !connectionString.includes('postgresql://')) {
    console.error('❌ Invalid DATABASE_URL. Please check your environment variables.');
    process.exit(1);
}

const knex = knexLib({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    },
    pool: { min: 2, max: 10 },
});

knex.raw('SELECT 1').then(() => {
    console.log('✅ PostgreSQL Connected');
}).catch((err) => {
    console.error('❌ PostgreSQL Connection Error:', err);
    process.exit(1);
});

module.exports = knex;

