var console = require("console");
var fs = require("fs");

module.exports = function()
{
  console.log("determining configuration...");
  switch(process.env.NODE_ENV)
  {
    case 'development':
    {
      return {
        port: 3000,
        hostname: "https://localhost:3000",
        options: {
          key: fs.readFileSync(__dirname + "/../keys/app.klearchoice.com.key"),
          cert: fs.readFileSync(__dirname + "/../keys/app.klearchoice.com.crt")
        }
      };
      break;
    }
    case 'production':
    {
      return {
        port: 443,
        hostname: "https://app.klearchoice.com",
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
