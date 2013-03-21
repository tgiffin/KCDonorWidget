var express = require("express"); //web framework
var redis_store = require("connect-redis")(express);
var everyauth = require("everyauth"); //oath lib
var urllib = require("url"); //for parsing urls
var util = require("util");
var console = require("console");
var Config = require("./config"); //environment configuration settings
var conf = new Config();
var log = conf.logger;
var session_store = null;

log.name("DonorWidget");
if(conf.env == "development") 
{
  var session_store = new express.session.MemoryStore();
}
else if(conf.env == "production")
{
  var session_store = new redis_store();
}


if(!conf.port) { console.log("unable to determine configuration, please check environment variables"); return; }

/** 
 * Ensure the user is logged in for any path other than those listed in the exceptions array
 */
function authenticate(request, response, next)
{
  //console.log("authenticate...");
  log.debug("authenticate request: " + request.url);
  var exceptions = [ 
                      //unsecured html routes
                      '/favicon.ico',
                      '/donor_widget.html',
                      '/register.html',

                      //unsecured API routes
                      '/auth',
                      '/donate', //this may be called either authenticated or not
                      '/charity',
                      '/register_charity',
                      '/save_charity',
                      '/get_donor',
                  ]
  var pathname = urllib.parse(request.url).pathname;

  if(exceptions.indexOf(pathname) >= 0) {next(); return; }
  log.debug("request not in exception list, authenticating: " + request.url);

  if(request.session && request.session.auth) {
    log.debug("Authentication successful");
    next(); 
    return; 
  }

  log.debug("Authentication failed, redirecting...");
  response.redirect(conf.hostname + "/donor_widget.html");
  response.end();
}

/**
 * Send P3P response to allow cookies on IE inside iframe
 */
function P3P(request, response, next)
{
  response.header('P3P','CP="Klear Choice respects your privacy. For more information or concerns, email us at privacy@klearchoice.com"');
  next();
}


console.log("Creating server instance..."); 
if(conf.options)
{
  var app = express.createServer(conf.options);
}
else
{
  var app = express.createServer();
}

exports.app = app;

/* Config */

//set up express
app.use(P3P); //send P3P headers on all requests, even static
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({store: session_store, secret:"let's agree to disagree about not agreeing", cookie: { secure: true, httpOnly: true} }));
app.use(authenticate);
app.use(app.router);
app.set("views",__dirname + "/templates/");

/* Request Handlers */
var routes = require("./routes");
routes.forEach(
  function(item)
  {
    console.log("Registering route: " + item.verb + " - " + item.path + " = " + util.inspect(item.action));
    app[item.verb](item.path,item.action);
  });
//ensure error handler is last item in middleware stack
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


console.log("Starting klearchoice server on " + conf.port + "...");
/* Server startup */
app.listen(conf.port);



