
/**
 * Calculate the next subscription date for recurring transactions
 */
exports.getNextSubscriptionDate = function (frequency, create_date)
{
  var dt = new Date();
  switch(frequency)
  {
    case "daily":
      dt.setDate(dt.getDate() + 1);
      break;
    case "weekly":
      dt.setDate(dt.getDate() + 7);
      break;
    case "biweekly":
      dt.setDate(dt.getDate() + 14);
      break;
    case "monthly":
      //check to see if the last day of next month is less than the subscription date,
      //if so, adjust accordingly
      var current_date = new Date();
      var temp_date = new Date(current_date.getFullYear(),current_date.getMonth() + 2,1);
      var last_day_of_next_month = (new Date(temp_date - 1)).getDate();
      var subscription_day = create_date.getDate();
      if(last_day_of_next_month < subscription_day)
        dt = new Date(dt.getFullYear(), dt.getMonth() + 1, last_day_of_next_month);
      else
        dt.setMonth(dt.getMonth() + 1);
      break;
  }
  
  return dt;
}

