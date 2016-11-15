Pusher.logToConsole = true;

// we get a random user name for simplicity’s sake
var user = 'anon-' + Math.random().toString().substring(2);

// so we know who’s who
console.log('Hi there ' + user);

var pusher = new Pusher('XXXXXXXXXXXXXXXXXXXX', {
  encrypted: true,
  authEndpoint: 'http://127.0.0.1:5000/pusher/auth',
  auth: {
    params: {
      user: user
    }
  }
});

// returns a channel specific function that lists all currently connected
// members and their respective states
var listMembers = function (channel) {
  return function () {
    console.log('Current users in ' + channel.name + ':')
    channel.members.each(function (member) {
      console.log('user: ' + member.info.user + '  |  state: ' + member.info.state);
    });
  }
};

// subscribes to the given channel with the given state in the user info, also
// updates the state in an existing subscription by resubscribing
var subscribeWithState = function (channelName, state) {
  pusher.unsubscribe(channelName);
  pusher.config.auth.params.state = state;
  channel = pusher.subscribe(channelName);

  channel.bind('pusher:subscription_succeeded', listMembers(channel));
  channel.bind('pusher:member_added', listMembers(channel));
  channel.bind('pusher:member_removed', listMembers(channel));
};

subscribeWithState('presence-one', 'default');
subscribeWithState('presence-two', 'default');

// to update state of 'presence-one' to 'viewing' just call
// subscribeWithState('presence-one', 'viewing');
