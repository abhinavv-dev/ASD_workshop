// In-memory cache store object
const cache = {};

// Cache expiration time in milliseconds (60 seconds)
const CACHE_DURATION = 60 * 1000;

const cacheMiddleware = (req, res, next) => {
    // For non-GET requests (POST, PUT, PATCH, DELETE), clear the cache so stale data isn't served
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        for (let key in cache) {
            delete cache[key];
        }
        return next();
    }

    // Use req.originalUrl to ensure full route path (e.g. /products/1) is used as cache key
    const key = req.originalUrl || req.url;
    const cachedItem = cache[key];
    const now = Date.now();

    // If data exists in cache and has not expired, return cached response
    if (cachedItem && (now - cachedItem.timestamp < CACHE_DURATION)) {
        res.setHeader('Cache', 'HIT');
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedItem.data);
    }

    // Cache miss: set header and continue to the controller
    res.setHeader('Cache', 'MISS');
    res.setHeader('X-Cache', 'MISS');

    // Save reference to original res.json method
    const originalJson = res.json.bind(res);

    // Override res.json to intercept and cache the response data
    res.json = (body) => {
        // Only cache successful responses (HTTP 200-299)
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cache[key] = {
                data: body,
                timestamp: Date.now()
            };
        }
        return originalJson(body);
    };

    next();
};

module.exports = cacheMiddleware;