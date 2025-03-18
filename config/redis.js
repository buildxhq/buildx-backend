const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

redisClient.connect()
    .then(() => console.log('✅ Redis Connected'))
    .catch((err) => {
        console.error('❌ Redis Connection Error:', err);
        process.exit(1);
    });

module.exports = redisClient;
