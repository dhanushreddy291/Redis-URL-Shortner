const Redis = require("ioredis");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
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
  if (myJson != undefined) {
    myValue = myJson.CPURL;
    myOtherValue = myJson.UNCPURL;
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
    } else res.send("Inavlid URL");
  }
});

app.get("/", async (req, res) => {
  res.render(__dirname + "/index.html");
});

app.listen(Port, () => {
  console.log(`Redis URL Shortner Listening on ${Port}`);
});
