const redisClient = redis.createClient( REDIS_URL );

module.exports = { redisClient };