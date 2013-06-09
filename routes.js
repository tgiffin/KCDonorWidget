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
  {
    verb: 'get',
    path: '/profile.html',
    action: actions.profile
  },
  {
    verb: 'get',
    path: '/reset_password.html',
    action: actions.reset_password
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
    path: '/logout',
    action: actions.logout
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
    verb: 'get',
    path: '/subscriptions',
    action: actions.get_subscriptions
  },
  {
    verb: 'post',
    path: '/subscription/cancel',
    action: actions.cancel_subscription
  },
  {
    verb: 'post',
    path: '/subscription/create',
    action: actions.create_subscription
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
  },
  {
    verb: 'post',
    path: '/recover_password',
    action: actions.recover_password
  },
  {
    verb: 'post',
    path: '/set_password',
    action: actions.set_password
  },
  {
    verb: 'post',
    path: '/set_email',
    action: actions.update_donor_email
  },
  {
    verb: 'get',
    path: '/donation_history',
    action: actions.get_donation_history
  }
];
