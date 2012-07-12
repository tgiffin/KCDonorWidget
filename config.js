var console = require("console");
var fs = require("fs");
var log = require("./logly");

module.exports = function()
{
  console.log("determining configuration...");
  switch(process.env.NODE_ENV)
  {
    case 'development':
    {
      log.mode("debug");
      return {
        env: "development",
        logger: log,
        port: 3000,
        hostname: "https://localhost:3000",
        dwolla_path: "/oauth/rest/testapi/send",
        //dwolla_path: "/oauth/rest/transactions/send",
        dwolla_app_id: "1JUZIa33HXhhyyDhX3PpT6XDk8vp3B0NtO0lQe7rbxKiOhYTGI",
        dwolla_app_secret: "pTqTyg6VCVMO6UlgXnarzqndt3mJLDJdJNiI4dLSwDo3rIoi3/",
        options: {
          key: fs.readFileSync(__dirname + "/../keys/app.klearchoice.com.key"),
          cert: fs.readFileSync(__dirname + "/../keys/app.klearchoice.com.crt")
        }
      };
      break;
    }
    case 'production':
    {
      log.mode("debug");
      //log.mode("warn");
      return {
        env: "production",
        logger: log,
        port: 443,
        hostname: "https://app.klearchoice.com",
        dwolla_path: "/oauth/rest/transactions/send",
        dwolla_app_id: "1JUZIa33HXhhyyDhX3PpT6XDk8vp3B0NtO0lQe7rbxKiOhYTGI",
        dwolla_app_secret: "pTqTyg6VCVMO6UlgXnarzqndt3mJLDJdJNiI4dLSwDo3rIoi3/",
        options: {
          key: fs.readFileSync("/home/node/app.klearchoice.com.key"),
          cert: fs.readFileSync("/home/node/app.klearchoice.com.crt")
        }
      };
      break;
    }
    case 'default':
    {
      throw new Error("unconfigured environment variable");
      break;
    }
  }
};
