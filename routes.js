var actions = require("./actions");

module.exports = [
  {
    verb: 'get',
    path: '/test/',
    action: function(request, response) { response.send('hello?');}
  },
  {
    verb: 'get',
    path: '/donor_widget.html',
    action: actions.donor_widget
  },
  {
    verb: 'get',
    path: '/authenticate_complete.html',
    action: actions.authenticate_complete
  },
  {
    verb: 'post',
    path: '/confirm_amount',
    action: actions.confirm_amount
  },
  {
    verb: 'post',
    path: '/send_payment',
    action: actions.send_payment
  },
  {
    verb: 'get',
    path: '/thank_you.html',
    action: actions.thank_you
  }
];