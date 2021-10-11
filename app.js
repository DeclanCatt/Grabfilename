var express = require("express");
var app = express();
const Redis = require("ioredis");
const redis = new Redis(); // uses defaults unless given configuration object

const RedisTimeSeries = require('redistimeseries-js');
// check base redis client for options
// https://github.com/NodeRedis/node_redis
const options = {
  host: 'localhost',
  port: 6379
}
const rtsClient = new RedisTimeSeries(options);

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
   
app.post('/push-list', upload.array(), async function (req, res, next) {
    console.log(req.body)
    try {
        const result = await redis.rpush(req.body.id + ":files", ...req.body.resources);
        res.json('{"result": "OK"}')
    } catch (error) {
        console.error(error)
        res.json('{"result": "ERROR"}')
    }
})

app.post('/client-list', upload.array(), async function (req, res, next) {
    await rtsClient.connect();
    await rtsClient.create(req.body.id + ":log").send();
    try {
        await rtsClient.add(req.body.id + ":log", Date.now(), res.body.resources).send();
        res.json('{"result": "OK"}')
    } catch (error) {
        console.error(error)
        res.json('{"result": "ERROR"}')
    }
})