#!/usr/bin/env bash
# Wires YouTube into the Appwrite function "yt" (sets env vars, redeploys). Prints no secrets.
set -e; S=/workspace/.secrets; K=$(cat $S/appwrite-key.txt); A=https://fra.cloud.appwrite.io/v1
CID=$(python3 -c "import json;print(json.load(open('$S/yt-client.json'))['client_id'])"); CS=$(python3 -c "import json;print(json.load(open('$S/yt-client.json'))['client_secret'])"); RT=$(cat $S/yt-refresh-token.txt)
v(){ curl -s -o /dev/null -w "$1 %{http_code}\n" -X POST $A/functions/yt/variables -H 'X-Appwrite-Project: teamseriously' -H "X-Appwrite-Key: $K" -H 'Content-Type: application/json' -d "{\"variableId\":\"$1\",\"key\":\"$1\",\"value\":\"$2\",\"secret\":true}"; }
v YT_CLIENT_ID "$CID"; v YT_CLIENT_SECRET "$CS"; v YT_REFRESH_TOKEN "$RT"; v YT_PRIVACY "${1:-public}"
cd /tmp && tar czf yt.tar.gz -C /workspace/tsfn/yt package.json src && curl -s -o /dev/null -w "deploy %{http_code}\n" -X POST $A/functions/yt/deployments -H 'X-Appwrite-Project: teamseriously' -H "X-Appwrite-Key: $K" -F code=@/tmp/yt.tar.gz -F activate=true
echo "token check:"; curl -s https://oauth2.googleapis.com/token -d client_id=$CID -d client_secret=$CS -d refresh_token=$RT -d grant_type=refresh_token | python3 -c "import json,sys;d=json.load(sys.stdin);print('ok' if 'access_token' in d else d)"
