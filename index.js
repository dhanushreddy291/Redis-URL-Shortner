const Redis = require("ioredis");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
dotenv.config();

const Port = 4000;

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
  if (typeof myJson !== "undefined") {
    addUrlToRedis(myJson.CPURL, myJson.UNCPURL);
  }
  console.log(myJson.UNCPURL + " => " + myJson.CPURL);
  res.json(myJson);
});

app.get("/:url", async (req, res) => {
  if (req.params.url !== "favicon.ico") {
    const URLParam = await HSETSearch(req.params.url);
    if (URLParam !== null) {
      res.redirect(302, URLParam);
    } else res.sendFile(path.join(__dirname, "/public", "/invalid.html"));
  }
});

app.get("/", async (req, res) => {
  res.render("/index.html");
});

app.listen(Port, () => {
  console.log(`Redis URL Shortner Listening on ${Port}`);
});
