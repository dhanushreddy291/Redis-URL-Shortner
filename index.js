const Redis = require("ioredis");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const app = express();
app.use(express.json());

const port = 4000;

const redis = new Redis({
  port: process.env.port,
  host: process.env.host,
  username: process.env.username,
  password: process.env.password,
});

const HSETSearch = async (key) => {
  let url = await redis.hget(process.env.URLSetName, key);
  return url;
};

const addUrlToRedis = async (key, value) => {
  await redis.evalsha(process.env.SCRIPT_HASH, 1, key, value);
};

app.post("/", async (req, res) => {
  let myJson = req.body;
  if (myJson != undefined) {
    myValue = myJson.CPURL;
    myOtherValue = myJson.UNCPURL;
    addUrlToRedis(myJson.CPURL, myJson.UNCPURL);
  }
  console.log(myJson.UNCPURL + " => " + myJson.CPURL);
  res.json(myJson);
});

app.get("/:id", async (req, res) => {
  const origURL = await HSETSearch(req.params.id);
  if (origURL) {
    res.json({ origURL, exists: "true" });
  } else res.json({ exists: "false" });
});

app.listen(port, () => {
  console.log(`Redis URL Shortner Backend Listening on ${port}`);
});
