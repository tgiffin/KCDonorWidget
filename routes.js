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
    path: '/donor_widget_amount.html',
    action: actions.donor_widget_amount
  },
  {
    verb: 'post',
    path: '/donor_widget_amount.html',
    action: actions.donor_widget_validate_amount
  },
  {
    verb: 'get',
    path: '/donor_widget_confirm.html',
    action: actions.confirm_amount
  },
  {
    verb: 'post',
    path: '/donor_widget_confirm.html',
    action: actions.send_payment
  },
  {
    verb: 'get',
    path: '/donor_widget_thank_you.html',
    action: actions.thank_you
  },
  {
    verb: 'get',
    path: '/register.html',
    action: actions.register
  },

  /**
   * API routes
   */
  {
    verb: 'post',
    path: '/send_payment',
    action: actions.send_payment
  },
  {
    verb: 'post',
    path: '/register_charity',
    action: actions.register_charity
  },
  {
    verb: 'post',
    path: '/save_charity',
    action: actions.save_charity
  },
  {
    verb: 'post',
    path: '/get_donor',
    action: actions.get_donor
  }
];
