var express = require("express");
var console = require("console");
var Config = require("./config");
var conf = new Config();

if(!conf.port) { console.log("unable to determine configuration, please check environment variables"); return; }

console.log("Starting klearchoice server on " + conf.port + "...");
var app = express.createServer();

app.use(express.static(__dirname + '/static'));

app.get("/test/", function(request, response)
        {
            response.send("hello?");
        });

app.listen(conf.port);
