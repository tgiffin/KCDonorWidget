/**
 * Secure file writer
 *
 * This takes any incoming string and writes it to a file at the target location.
 * It uses stdin to pip the string to ssh, which then cat's the string out the the file at the target address.
 * This assumes that ssh keys have already been configured on the client and target, no password authentication
 * is supported.
 *
 * For questions or support contact Clay Gulick (clay@ratiosoftware.com)
 *
 * History
 *
 * Date       Author        Comments
 * --------------------------------------------
 *  4/5/2013  Clay Gulick   Initial version created
 */
var spawn = require('child_process').spawn;

var exports = module.exports = {};

exports.write_file = function(contents, file_name, target, callback)
{
  var err;
  var ssh = spawn('ssh', [
                            target, //the user@host param to ssh
                            "cat > " + file_name //the remote command to execute
                          ]);
  //set up handlers
  //error handler
  ssh.stderr.on('data',
    function(data)
    {
      err += data;
    });

  ssh.on('error',
    function(err)
    {
      callback(err);
    });

  //completion handler
  ssh.on("exit",
    function(code)
    {
      if(code != 0)
      {
        callback("Error code: " + code + " - " + err); //notify caller of error
        return;
      }

      callback(null) //notify caller of success

    });

  ssh.stdin.write(contents); //pipe the contents of the file to ssh
  ssh.stdin.end();

}

