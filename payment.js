var https = require('https');
var console = require('console');
var util = require('util');
var conf = require("./config")();
var log = conf.logger;

exports.dwolla = 
{
  klearchoice_fee: .20,
  processor_fee: .25,
  send: function(params)
  {
    var success_callback = params.success_callback;
    var error_callback = params.error_callback;
    var path = conf.dwolla_path + "?oauth_token=" + encodeURIComponent(params.user_token);

    var body = JSON.stringify(
      {
        //oauth_token: params.user_token,
        pin: params.pin,
        destinationId: params.destination_id,
        amount: params.amount,
        //assumeCosts: true,
        //notes: "Charitable donation facilitated by KlearChoice Inc"
      });

    var req = https.request(
      {
        hostname: 'www.dwolla.com',
        path: path,
        method: 'POST',
        headers: {"Content-Type":"application/json"}
      });
    req.on("response", function(response)
      {
        var result='';
        response.on('data', 
          function(chunk) 
          { 
            result += chunk; 
          });
        response.on('end', 
          function() 
          { 
            handle_result(result); 
          });
      });
    req.on("error", function(error)
      {
        console.log("Error in http request!");
      });
    //console.log("path: " + path + " request: " + body);
    log.debug("payment request - path: " + path + " request: " + body);
    req.write(body);
    req.end();

    function handle_result(result)
    {
      var p = {};
      try
      {
        p = JSON.parse(result);
      }
      catch(err)
      {
        log.error("Error parsing server result: " + result);
        p.Success=false;
        p.Message="There was a problem communicating with the payment gateway. Please try again later.";
      }
      console.log(util.inspect(p));

      if(p.Success==false)
      {
        if(error_callback) error_callback(p.Message);
        return;
      }

      if(p.Success==true)
      {
        if(success_callback) success_callback(p);
        return;
      }

      if(error_callback) error_callback("Unknown response received from payment gateway. Please try again later.");

    }


  }
}
