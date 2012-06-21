var console = require("console");

module.exports = function()
{
  console.log("determining configuration...");
  switch(process.env.NODE_ENV)
  {
    case 'development':
    {
      return {
        port: 3000
      };
      break;
    }
    case 'production':
    {
      return {
        port: 80
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
