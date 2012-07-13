var mysql = require("mysql");
var util = require("util");
var conf = new (require("./config"))();
var log = conf.logger;
var connection;

module.exports = {

  open: function()
  {
    connection = mysql.createConnection(
      {
        host: conf.db_host,
        user: conf.db_username,
        database: conf.db_name,
        password: conf.db_password
      });
    connection.connect(
      function(err)
      {
        log.error("CRITICAL ERROR: Unable to connect to database:" + util.inspect(err));
      }
    );
    connection.on("error",
      function(err) 
      {
        log.error("CRITICAL ERROR: database error: " + util.inspect(err)); 
      });
  },

  close: function()
  {
    connection.end();
  },

  getCharity: function(charity_id, callback, error_callback)
  {
    connection.query("select id, charity_name, dwolla_id from charity where id=?",[charity_id],
      function(err, rows)
      {
        if(err)
        {
          log.error("Error retrieving charity information from database. Charity id: " + charity_id + ". Err: " + err);
          if(error_callback) error_callback(err);
        }
        else
        {
          callback(rows[0]);
        }
      });
  },

  logTransaction: function(transaction, error_callback)
  {
    connection.query("insert into transactions set ?", transaction,
      function(err,result)
      {
        if(err)
        {
          log.error("Error inserting transaction: " + util.inspect(transaction) + " err: " + err);
          if(error_callback) error_callback(err);
        }
      });
  }

}
