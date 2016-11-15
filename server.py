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

@app.route('/pusher/auth', methods=['POST'])
def pusher_authentication():
  auth = pusher_client.authenticate(
    channel=request.form['channel_name'],
    socket_id=request.form['socket_id'],
    custom_data={
      'user_id': request.form['socket_id'],
      'user_info': {
        'user': request.form['user'],
        'state': request.form['state']
      }
    }
  )
  return json.dumps(auth)
