#!/usr/bin/env python3
# One-time: get a YouTube refresh token. Needs /workspace/.secrets/yt-client.json ({"client_id":..,"client_secret":..}).
# Prints a Google consent URL; open it IN THE BOX BROWSER, sign in as teamseriously@mail.grokbot.com, allow.
# Google redirects to http://localhost:8765/ which this script catches; refresh token -> /workspace/.secrets/yt-refresh-token.txt
import json,urllib.parse,urllib.request,http.server,os
c=json.load(open('/workspace/.secrets/yt-client.json'));R='http://localhost:8765/'
print('OPEN:', 'https://accounts.google.com/o/oauth2/v2/auth?'+urllib.parse.urlencode({'client_id':c['client_id'],'redirect_uri':R,'response_type':'code','access_type':'offline','prompt':'consent',
 'scope':'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly','login_hint':'teamseriously@mail.grokbot.com'}),flush=True)
class H(http.server.BaseHTTPRequestHandler):
  def do_GET(s):
    q=urllib.parse.parse_qs(urllib.parse.urlparse(s.path).query)
    if 'code' not in q: s.send_response(400);s.end_headers();s.wfile.write(b'no code');return
    d=urllib.parse.urlencode({'code':q['code'][0],'client_id':c['client_id'],'client_secret':c['client_secret'],'redirect_uri':R,'grant_type':'authorization_code'}).encode()
    j=json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token',d))
    p='/workspace/.secrets/yt-refresh-token.txt';open(p,'w').write(j['refresh_token']);os.chmod(p,0o600)
    s.send_response(200);s.end_headers();s.wfile.write(b'OK - refresh token saved. You can close this tab.');print('saved refresh token',flush=True);raise SystemExit
  def log_message(s,*a):pass
http.server.HTTPServer(('127.0.0.1',8765),H).handle_request()
