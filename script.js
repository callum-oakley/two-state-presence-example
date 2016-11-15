Pusher.logToConsole = true;

// we get a random user name for simplicity’s sake
var user = 'anon-' + Math.random().toString().substring(2);
var state = 'default'

// so we know who’s who
console.log('Hi there ' + user);


var pusher = new Pusher('XXXXXXXXXXXXXXXXXXXX', {
  encrypted: true,
  authEndpoint: 'http://127.0.0.1:5000/pusher/auth',
  auth: {
    // the auth endpoint needs to know who you are
    params: {
      user: user,
      state: state
    }
  }
});


// lists all currently connected members and, crucially, their state
// demonstrating that you could easily loop through and ignore all members with
// a particular state
var listMembers = function () {
  console.log('Current users:')
  channel.members.each(function (member) {
    console.log('user: ' + member.info.user + '  |  state: ' + member.info.state);
  });
};


var subscribeAndBind = function () {
  channel = pusher.subscribe('presence-channel');

  // every time anything presence related happens, show the updated list
  channel.bind('pusher:subscription_succeeded', listMembers);
  channel.bind('pusher:member_added', listMembers);
  channel.bind('pusher:member_removed', listMembers);
};


// change the state by mutiating the auth params
var changeState = function (newState) {
  pusher.unsubscribe('presence-channel');
  pusher.config.auth.params.state = newState;
  subscribeAndBind();
};


var channel = null;
subscribeAndBind();
