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
        if(err)
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

  get_charity: function(charity_id, callback)
  {
    connection.query("select id, charity_name, dwolla_id from charity where id=?",[charity_id],
      function(err, rows)
      {
        if(err)
        {
          log.error("Error retrieving charity information from database. Charity id: " + charity_id + ". Err: " + err);
        }
        /*if(rows.length < 1)
        {
          return callback(new Error("Unable to locate charity for id: " + charity_id),null);
        }*/
        callback(err,rows[0]);
      });
  },

  log_transaction: function(transaction, callback)
  {
    connection.query("insert into transactions set ?", transaction,
      function(err,result)
      {
        if(err)
        {
          log.error("Error inserting transaction: " + util.inspect(transaction) + " err: " + err);
          if(callback) callback(err,result);
        }
      });
  },

  save_charity: function(charity_info, callback)
  {
    connection.query("insert into charity ser ?", charity_info,
      function(err, result)
      {
        if(err)
        {
          log.error("Error inserting charity: " + util.inspect(charity_info) + " error: " + err);
          if(callback) callback(err, result);
        }

        if(callback) callback(err, result.insertId);
          
      });
  },

  get_donor_id: function(user,callback)
  {
    var id = user.processor_id;
    if(!id) { callback(new Error("Missing user id")); return; }

    connection.query("select * from donor where processor_id=?",[id],
      function(err,result)
      {
        if(err) { callback(err); return; }

        if(result.length < 1)  
        {
          //we don't have a record, need to insert
          connection.query("insert into donor set ?",
            user,
            function(err,result)
            {
              return callback(err, result.insertId);
            });
          return;
        }

        return callback(null, result[0].id);

      });
  }


}
