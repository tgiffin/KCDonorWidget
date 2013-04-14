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
        prevent_payment_processing: true,
        logger: log,
        port: 3000,
        db_host: '192.168.1.100',
        db_name: 'klearchoice',
        db_username: 'klearchoice',
        db_password: 'KC02242012',
        hostname: "https://dev.klearchoice.com:3000",
        account_file_target: "incoming@192.168.1.114",
        account_public_key: fs.readFileSync(__dirname + "/../keys/payment_server.pub"),
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
        app_user_id: "recurse",
        app_group_id: "recurse",
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
        prevent_payment_processing: false,
        logger: log,
        port: 443,
        db_host: 'localhost',
        db_name: 'klearchoice',
        db_username: 'klearchoice',
        db_password: 'KC2242012',
        hostname: "https://app.klearchoice.com",
        account_file_target: "incoming@payment_server -p 4242",
        account_public_key: fs.readFileSync("/home/app/keys/payment_server.pub"),
        dwolla_id: "812-708-2911", //this is the klearchoice account id
        dwolla_path: "/oauth/rest/transactions/send",
        dwolla_guest_send_path: "/oauth/rest/transactions/guestsend",
        dwolla_balance_path: "/oauth/rest/balance/",
        dwolla_funding_source_path: "/oauth/rest/fundingsources/",
        dwolla_register_path: "/oauth/rest/register/",
        dwolla_app_id: "1JUZIa33HXhhyyDhX3PpT6XDk8vp3B0NtO0lQe7rbxKiOhYTGI",
        dwolla_app_secret: "pTqTyg6VCVMO6UlgXnarzqndt3mJLDJdJNiI4dLSwDo3rIoi3/",
        app_user_id: "app",
        app_group_id: "app",
        options: {
          key: fs.readFileSync("/home/app/keys/app.klearchoice.com.key"),
          cert: fs.readFileSync("/home/app/keys/app.klearchoice.com.crt")
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
