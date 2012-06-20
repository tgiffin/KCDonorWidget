var express = require("express");
var console = require("console");
var mustache = require("mustache"); //templating engine
var fs = require("fs");
var Config = require("./config");
var conf = new Config();

if(!conf.port) { console.log("unable to determine configuration, please check environment variables"); return; }

console.log("Starting klearchoice server on " + conf.port + "...");
var app = express.createServer();

/* Config */
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());
app.set("views",__dirname + "/templates/");

/* Request Handlers */
app.get("/test/", function(request, response)
        {
            response.send("hello?");
        });
app.get("/donor_widget.html", function(request, response)
  {
    //console.log("donor widget: charity_id:" + request.params['charity_id']);
    //console.log(request);
    response.send(mustache.to_html(loadTemplate('donor_widget'),
      {
        charity_id: request.query['charity_id']
      }));

  });


/* Server startup */
app.listen(conf.port);


/* Utility functions */

/**
 * Tiny utiltiy function to load a template using the views path
 */
function loadTemplate(template) {
    return fs.readFileSync(app.set('views') + template+ '.html')+ '';
}

