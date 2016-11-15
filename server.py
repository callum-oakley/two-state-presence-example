from flask import Flask, request
import pusher
import json


app = Flask(__name__)


pusher_client = pusher.Pusher(
  app_id='XXXXXX',
  key='XXXXXXXXXXXXXXXXXXXX',
  secret='XXXXXXXXXXXXXXXXXXXX',
  ssl=True
)


state = {}


@app.route('/pusher/auth', methods=['POST'])
def pusher_authentication():
  user = request.form['user']

  if not user in state:
    state[user] = 'default'

  auth = pusher_client.authenticate(
    channel=request.form['channel_name'],
    socket_id=request.form['socket_id'],
    custom_data={
      'user_id': request.form['socket_id'],
      # set the user and that user’s state
      'user_info': {
        'user': user,
        'state': state[user]
      }
    }
  )

  return json.dumps(auth)

# update the state of a given user
@app.route('/pusher/state', methods=['POST'])
def pusher_update_state():
    state[request.form['user']] = request.form['state']
    return json.dumps(True)
