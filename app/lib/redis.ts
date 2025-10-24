import { createClient } from "redis";


const url = process.env.REDIS_URL || "redis://localhost:6379";


const redis = createClient({url});


redis.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  try {
    if (!redis.isOpen) await redis.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

export default redis;