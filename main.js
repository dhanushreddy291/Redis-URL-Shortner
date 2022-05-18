const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

const redis = new Redis({
  port: process.env.port,
  host: process.env.host,
  username: process.env.username,
  password: process.env.password,
});

const keySearch = async (key) => {
  const reply = await redis.get(key);
  console.log(reply);
};

const add = async (key, value) => {
  const reply = await redis.set(key, value);
  console.log(reply);
};

const add_script = async (key, value) => {
  const reply = await redis.evalsha(process.env.SCRIPT_HASH, 1, key, value);
  console.log(reply);
};

add_script("twtr", "https://twitter.com");
