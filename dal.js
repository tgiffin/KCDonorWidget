var mysql = require("mysql");
var crypto = require("crypto");
var util = require("util");
var conf = new (require("./config"))();
var log = conf.logger;
var connection;

module.exports = {

  /**
   * Open connection to the database
   */
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

  /**
   * Close database connection
   */
  close: function()
  {
    connection.end();
  },

  /**
   * Get charity info for the given id
   */
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

  /**
   * Lookup charity by website address. This is used to verify the charity by the http referrer
   */
  get_charity_by_domain: function(domain, callback)
  {
    connection.query("select id, charity_name, dwolla_id from charity where domain=?",[domain],
      function(err,rows)
      {
        if(err)
        {
          log.error("Error retrieving charity information from database. Domain: " + domain + ". Err: " + err);
        }
        if(!rows || (rows.length < 1))
        {
          callback(null,null); //there wasn't an error, but the charity wasn't found. The action will redirect to an error page
        }
        else
        {
          callback(err,rows[0]);
        }

      });
  },

  /**
   * Insert a row into the transaction log. This happens any time a donation is made
   */
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

  /**
   * Saves charity information. If charity_info.id is truthy, the charity information will be updated,
   * otherwise a new record will be created
   */
  save_charity: function(charity_info, callback)
  {
    if(charity_info.id)
    {
      connection.query("update charity set ? where id=?", [charity_info,charity_info.id],
        function(err, result)
        {
          if(err)
          {
            log.error("Error updating charity: " + util.inspect(charity_info) + " error: " + err);
            if(callback) callback(err, result);
            return;
          }

          if(callback) callback(err, charity_info.id);
        });
    }
    else
    {
      connection.query("insert into charity set ?", charity_info,
        function(err, result)
        {
          if(err)
          {
            log.error("Error inserting charity: " + util.inspect(charity_info) + " error: " + err);
            if(callback) callback(err, result);
            return;
          }

          if(callback) callback(err, result.insertId);
            
        });
    }
  },

  /**
   * This inserts a donor record. It doesn not check if the donor already exists.
   * With the guest send, non-member donation flow, there can (and will) be multiple
   * donor records with the same email etc...
   *
   * This is because a donor can come back multiple times to make donations. For security
   * reasons, we don't try to match and update the existing donor record in this scenario,
   * we create a new donor record. This is to prevent an exploit whereby a person could
   * update or change information in the database by just having an email address
   */
  add_donor: function(donor, callback)
  {
    connection.query("insert into donor set ?", donor,
      function(err, result)
      {
        callback(err,result);
      });
  },

  /**
   * Retrieve the donor based on the specified email address.
   * If a donor with the given email address doesn't exist, a new 
   * donor will be created with the given email
   */
  get_donor: function(donor,callback)
  {
    var email = donor.email;
    if(!email) { callback(new Error("Missing email")); return; }

    connection.query("select * from donor where email=?",[email],
      function(err,result)
      {
        if(err) { callback(err); return; }
        if(result.length < 1)
          return callback(null,null);

        return callback(null, result[0]);

      });
  },

  /**
   * Retrieve the donor based on the specified email address and password.
   * This is used for authentication of the user
   */
  get_donor_auth: function(donor,callback)
  {
    var email = donor.email;
    if(!email) { callback(new Error("Missing email")); return; }

    connection.query("select * from donor where email=? and member=1",[email],
      function(err,result)
      {
        if(err) { callback(err); return; }

        if(result.length < 1)  
        {
          //we don't have a record, authentication failed
          callback(null,null);
          return;
        }

        var salt = result[0].salt;
        var encrypted_password = crypto.pbkdf2Sync(donor.password,salt,5000,256).toString('base64');

        if(encrypted_password != result[0].password)
        {
          callback(null,null);
          return;
        }

        return callback(null, result[0]);

      });
  },

  /**
   * Update the donor information
   */
  update_donor: function(donor,callback)
  {
    connection.query("update donor set ? where id=?",
      [donor,donor.id],
      function(err,result)
      {
        callback(err);
      });
  }


}
