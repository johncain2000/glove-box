// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const axios = require('axios');
const history = require('connect-history-api-fallback');
const werkzeug = require('./lib/werkzeug.js')
const app = express();
const port = process.env.PORT || 8000;

const { MongoClient } = require('mongodb');


app.use(bodyParser.json());
app.use(cors());
app.use(history());
app.use(express.urlencoded({ extended: true }));

let mongoClient;

async function main() {
   const uri = process.env.MONGO_DB_URI
   mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

   try {
       await mongoClient.connect();
       console.log("Connected correctly to mongo server");
   } catch (e) {
       console.error(e);
   } finally {
      // await mongoClient.close()
   }
}
main()

if (process.env.NODE_ENV === 'production') {
  // for docker build
  app.use(bodyParser.json());
  app.use(express.static(process.cwd() + '/client/dist'));
}

const getToken = (req) => {
    const header = req.headers['authorization'];
    if (header) {
        const bearer = header.split('Bearer ');
        const token = bearer[1];
        return token;
    }
    return '';
}

const checkToken = (req, res, next) => {
    const token = getToken(req);
    if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_KEY);
          next();
        } catch(error) {
          res.status(403).send({error})
        }
    } else {
      res.sendStatus(403).send({error: "token missing"})
    }
}

app.get('/check-token', checkToken, (req, res) => {
  res.sendStatus(200);
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const db = mongoClient.db('users');
  const userData = await db.collection('admin').findOne({email: email.trim().toLowerCase() }, { sort: { _id: -1 } }) || {};
  const name = userData.name;
  const hashedPassword = userData.password;
  const validPassword = await werkzeug.checkPasswordHash(hashedPassword, password.trim());

  if (validPassword) {
    const user = {
      name,
      email,
    };
    const token = jwt.sign(user, process.env.JWT_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});
    res.status(200).send({
      token,
      user,
    })
  } else {
    res.status(403).send({
      message: "wrong login information",
    })
  }
})


app.get('/assets/:interval', checkToken, async (req, res) => {
  try {
    const interval = req.params.interval;
    const token = getToken(req);
    const URL = `${process.env.LEGACY_API}/services/target-assets?jwt=${token}`
    const data = {
      "selectInterval": interval,
      "upsec": "3",
      "lpsec": "-1"
    }
    const response = await axios.post(URL, data);
    res.status(200).send(response.data)
  } catch (e) {
    res.status(500).send({error: e.message})
  }
});


// listen on the port
console.log("Server listening on port", port)
app.listen(port);

// need 2 ports for prodution with cloudflare ssl
if (process.env.NODE_ENV === 'production') {
  app.listen(80);
}