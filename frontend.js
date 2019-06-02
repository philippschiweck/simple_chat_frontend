let express = require('express');
let app = express();
let http = require('http').Server(app);
let helmet = require('helmet')
let secure = require('express-force-https');
let hsts = require('hsts');

let bodyParser = require('body-parser')

let port = process.env.PORT || 8080;

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self' 'unsafe-eval' https://simple-chat-n-backend.eu-de.mybluemix.net"],
    styleSrc: ["'self' 'unsafe-inline'"],
    scriptSrc: ["'self' 'unsafe-eval' http: https:"],
    connectSrc: ["'wss://simple-chat-n-backend.eu-de.mybluemix.net"]
  }
}));

app.use(secure);

app.use(hsts({
  maxAge: 31536000 // One year is recommended
}));

app.use(function (req, res, next) {

  // Website allowed
  res.header('Access-Control-Allow-Origin', '*');

  // Request allowed methods
  res.header('Access-Control-Allow-Methods', 'GET');

  // Request allowed headers
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  next();
});

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.use(express.static(__dirname + '/dist'));
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

http.listen(port, () => {
  console.log("Listening on port " + port);
});
