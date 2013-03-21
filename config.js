var console = require("console");
var fs = require("fs");
var log = require("./lib/logly");

module.exports = function()
{
  console.log("determining configuration...");
  switch(process.env.NODE_ENV)
  {
    case 'development':
    {
      console.log("development");
      log.mode("debug");
      return {
        env: "development",
        logger: log,
        port: 3000,
        db_host: '192.168.1.100',
        db_name: 'klearchoice',
        db_username: 'klearchoice',
        db_password: 'KC02242012',
        hostname: "https://dev.klearchoice.com:3000",
        dwolla_id: "812-708-2911", //this is the klearchoice account id
        //dwolla_path: "/oauth/rest/testapi/send",
        dwolla_path: "/oauth/rest/transactions/send",
        dwolla_guest_send_path: "/oauth/rest/transactions/guestsend",
        dwolla_balance_path: "/oauth/rest/balance/",
        dwolla_funding_source_path: "/oauth/rest/fundingsources/",
        dwolla_register_path: "/oauth/rest/testapi/register/",
        //dwolla_register_path: "/oauth/rest/register/",
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
      console.log("production");
      log.mode("standard");
      //log.mode("warn");
      return {
        env: "production",
        logger: log,
        port: 443,
        db_host: '10.112.1.35',
        db_name: 'klearchoice',
        db_username: 'klearchoice',
        db_password: 'KC2242012',
        hostname: "https://app.klearchoice.com",
        dwolla_path: "/oauth/rest/transactions/send",
        dwolla_balance_path: "/oauth/rest/balance/",
        dwolla_funding_source_path: "/oauth/rest/fundingsources/",
        dwolla_register_path: "/oauth/rest/register/",
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
