var actions = require("./actions");

module.exports = [
  {
    verb: 'get',
    path: '/donor_widget.html',
    action: actions.donor_widget
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
    verb: 'get',
    path: '/auth',
    action: actions.is_auth
  },
  {
    verb: 'post',
    path: '/auth',
    action: actions.auth
  },
  {
    verb: 'post',
    path: '/donate',
    action: actions.donate
  },
  {
    verb: 'get',
    path: '/charity',
    action: actions.get_charity
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
