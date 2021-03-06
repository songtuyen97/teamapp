const express = require("express");
const config = require("config");
const body_parser = require("body-parser");
const session = require("express-session");
const cors = require('cors');
// const fileUpload = require("express-fileupload");

var app = express();
//accept localhost
app.use(cors());
app.use(body_parser.json({limit: '50mb'}));
app.use(body_parser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000,
  }));
// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/upload/'
// }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//body-parser

// app.use(body_parser.json());
// app.use(body_parser.urlencoded({extended:false}));
//express-session
app.set("trust proxy", 1);
app.set(session({
    secret: config.get("session.secret"), 
    cookie: { 
        maxAge: 60000 
    }
}));
//config path views
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
//config path css,js,imgs
app.use("/static", express.static(__dirname + "/public"));
//config path controllers
var controllers = require(__dirname + "/apps/controllers");
app.use(controllers);

var port = config.get("server.port");
var host = config.get("server.host");
app.listen(process.env.PORT || port, host, function(err) {
    if(err) console.log("Connect to " + port + "of Server fail");
    else  console.log("Connect to " + port + " of Server success!");
})
